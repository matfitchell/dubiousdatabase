from flask import Flask, request, jsonify
import mysql.connector
import os
import hashlib
import hmac
from flask_cors import CORS
from datetime import date


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
cursor.execute("DROP TABLE IF EXISTS `categoryToItem`")
cursor.execute("DROP TABLE IF EXISTS `item`")
cursor.execute("DROP TABLE IF EXISTS `category`")
cursor.execute("DROP TABLE IF EXISTS `user`")

# Create user table
# Create user table

sqlCreate = """ 
CREATE TABLE user (
  username varchar(255) NOT NULL,
  passWord varbinary(255) NOT NULL,
  passSalt varbinary(255) NOT NULL,
  email varchar(255) NOT NULL,
  firstName varchar(255) DEFAULT NULL,
  lastName varchar(255) DEFAULT NULL,
  PRIMARY KEY (username),
  UNIQUE KEY username_UNIQUE (username),
  UNIQUE KEY email_UNIQUE (email)
)
"""
itemCreate = """
CREATE TABLE item (
  itemId int NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  itemTitle varchar(255) NOT NULL,
  itemDesc varchar(255) NOT NULL,
  itemPrice int NOT NULL,
  placeDate DATE NOT NULL,
  PRIMARY KEY (itemId),
  FOREIGN KEY (username) REFERENCES user(username)
)
"""
categoryCreate = """
CREATE TABLE category (
  title varchar(255) NOT NULL,
  PRIMARY KEY(title)
)
"""
categoryToItemCreate = """
CREATE TABLE categoryToItem(
  matchId int NOT NULL AUTO_INCREMENT,
  itemId int NOT NULL,
  categoryTitle varchar(255) NOT NULL,
  PRIMARY KEY (matchId),
  FOREIGN KEY (categoryTitle) REFERENCES category(title),
  FOREIGN KEY (itemId) REFERENCES item(itemId)
)
"""

reviewCreate = """
CREATE TABLE review (
  reviewId int NOT NULL AUTO_INCREMENT,
  itemId int NOT NULL,
  username varchar(255) NOT NULL,
  rating int NOT NULL,
  description varchar(255) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (reviewId),
  FOREIGN KEY (itemId) REFERENCES item(itemId),
  FOREIGN KEY (username) REFERENCES user(username)
)
"""

cursor.execute(sqlCreate)
cursor.execute(itemCreate)
cursor.execute(categoryCreate)
cursor.execute(categoryToItemCreate)
cursor.execute(reviewCreate)


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
    sql = "INSERT INTO user (username, passWord, passSalt, email, firstName, lastName) VALUES (%s, %s, %s, %s, %s, %s)"
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
    sql = "SElECT passWord, passSalt FROM (user) WHERE username= %s"
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
  
  username = request.json['username']
  itemTitle = request.json['itemTitle']
  itemDesc  = request.json['itemDesc']
  itemCategory = request.json['itemCategory']
  itemPrice = request.json['itemPrice']
  placeDate = date.today()


  today_sql = f"{placeDate.year}-{placeDate.month}-{placeDate.day}"
  

  itemQuery = "SELECT COUNT(*) FROM item WHERE username = username AND DATE(placeDate) = CURDATE() VALUES (%d, %d)"
  values = (username, today_sql)
  itemCount: int = cursor.execute(itemQuery, values)
  exceeded: bool = False
  if itemCount >= 3:
    exceeded = True

  if exceeded == False:
    try:

      sql = "INSERT INTO item (username, itemTitle, itemDesc, itemPrice, placeDate) OUTPUT Inserted.itemId VALUES (%s, %s, %s, %d, %d)"
      values = (username, itemTitle, itemDesc, itemPrice, today_sql) 
      id = cursor.execute(sql, values)

      for e in itemCategory:  
        sql = "SELECT FROM category WHERE title = %s"
        values = (e,)
        found = cursor.execute(sql,values)
        if found is None:
          sql = "INSERT INTO category(title) VALUES (%s)"
          values = (e,)
          cursor.execute(sql,values)
        sql = "INSERT INTO categoryToItem(itemId, categoryTitle) VALUES (%d,%s)"
        values = (id,e)
        cursor.execute(sql,values)
    except Exception as e:
      print(e)
      

      response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response)


@app.route('/api/search/?<category>', methods=['GET'])
def search(category):

  foramtted_list: list = []

  try:
    category = request.args['category']

    query = "SELECT itemId FROM categoryToItem WHERE categoryTitle = %s"
    ids = cursor.execute(query, (category))

    for id in ids:

      sql = "SELECT * FROM item WHERE itemId = %d "
      values = (id,)
      cursor.execute(sql,values)
      result = cursor.fetchall()
      sql = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %d"
      values = (id,)
      cursor.execute(sql,values)
      categoryTitles = cursor.fetchall()
      item = {
        "id": result["itemId"],
        "title": result["itemTitle"],
        "desc" : result['itemDesc'],
        "price" : result['itemPrice'],
        "categories" : categoryTitles 
        } 
      foramtted_list.append(item)

    return jsonify(foramtted_list)


  except:
    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response)
  