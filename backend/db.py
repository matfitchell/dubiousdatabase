from flask import Flask, request, jsonify
import mysql.connector
import os
import hashlib
import hmac
from flask_cors import CORS
from datetime import datetime


os.environ['DB_PASS'] = 'password'

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get('DB_PASS'),
  database="dubiousdb"
)

cursor = db.cursor()

# Drop user table if it exists
cursor.execute("DROP TABLE IF EXISTS `user`")
cursor.execute("DROP TABLE IF EXISTS `item`")

# Create user table
sqlCreate = """ 
CREATE TABLE `user` (
  `userName` varchar(255) NOT NULL,
  `passWord` varbinary(255) NOT NULL,
  `passSalt` varbinary(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userName`),
  UNIQUE KEY `userName_UNIQUE` (`userName`),
  UNIQUE KEY `email_UNIQUE` (`email`)
)
"""

itemCreate = """ 
CREATE TABLE `item` (
  `userName` varchar(255) NOT NULL,
  `itemTitle` varchar(255) NOT NULL,
  `itemDesc` varbinary(255) NOT NULL,
  `itemCategory` varbinary(255) NOT NULL,
  `itemPrice` decimal(5, 2),
  `placedDate` DATE NOT NULL
)
"""
cursor.execute(sqlCreate)
cursor.execute(itemCreate)

def hash_password(password: str):
  # Generates bytestring of 16 random bytes
  salt = os.urandom(16)
  hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 110000)
  return hashed, salt

def check_password(hashed: bytes, password: str, salt: bytes) -> bool:
  # Hash entered password with their salt
  check_password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 110000)

  if check_password_hash == hashed:
    return True
  else:
    return False

@app.route('/api/register', methods=['POST'])
def register():
  username = request.json['username']
  password = request.json['password']
  email = request.json['email']
  first_name = request.json['first_name']
  last_name = request.json['last_name']

  # cursor = db.cursor()
  hashed_password, salt = hash_password(password)

  try:
    sql = "INSERT INTO user (userName, passWord, passSalt, email, firstName, lastName) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (username, hashed_password, salt, email, first_name, last_name)
    cursor.execute(sql, values)

    db.commit()
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    response = {
      "status": "failed",
      "message": "User already exists with username or email."
    }
    return jsonify(response), 401

  print(f"{cursor.rowcount} record{'' if cursor.rowcount == 1 else 's'} inserted.")

  response = {
    "message": "User successfully registered."
  }
  return jsonify(response)

@app.route('/api/login', methods=["POST"])
def login():
  username = request.json['username']
  password = request.json['password']

  # cursor = db.cursor()

  try:
    sql = "SElECT passWord, passSalt FROM (user) WHERE userName= %s"
    values = (username,)
    cursor.execute(sql, values)
    
    # Gets next row; there will only be 1 from sql query
    result = cursor.fetchone()
    
    # No user with specified username
    if result == None:
      response = {
        "message":"Invalid credentials. Please try again"
      }
      return jsonify(response), 401
    
    # Result in order of SELECT statement
    db_password, db_salt = result
    
    if check_password(db_password, password, db_salt):
      response = {
        "username": username
      }
      return jsonify(response)
    else:
      # Password did not match for specified user
      response = {
        "message":"Invalid credentials. Please try again."
      }
      return jsonify(response), 401
    
  except Exception as e:
    print(e)
    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response)
@app.route('/api/logout')
def logout():
  response = {
    "message":"Successfully logged out." 
  }
  return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)



@app.route('/api/insertItem', methods=['POST'])
def insertItem():
  
  userName = request.json['userName']
  itemTitle = request.json['itemTitle']
  itemDesc  = request.json['itemDesc']
  itemCategory = request.json['itemCategory']
  itemPrice = request.json['itemPrice']
  placeDate = datetime.today()
  

  itemQuery = "SELECT COUNT(*) FROM item WHERE userName = userName AND DATE(placedDate) = CURDATE(); VALUES (%d, %d)"
  values = (userName, datetime.Today())
  itemCount: int = cursor.execute(itemQuery, values)
  exceeded: bool = False
  if itemCount > 3:
    exceeded = True

  if exceeded == False:
    try:

      sql = "INSERT INTO item (username, itemTitle, itemDesc, itemCategory, itemPrice, placeDate) VALUES (%s, %s, %s, %s, %.2f, %d)"
      values = (userName, itemTitle, itemDesc, itemCategory, itemPrice, placeDate) 
      cursor.execute(sql, values)

    except Exception as e:
      print(e)
    
      response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response)


@app.route('/api/search', methods=['POST'])
def search():
  try:
    data = request.get_json()
    userInput = data.get('category')

    query = "SELECT * FROM your_table_name WHERE itemCategory = %s"
    cursor.execute(query, (userInput,))

    results = cursor.fetchall()
    return jsonify(results)
  
  except:
    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response)