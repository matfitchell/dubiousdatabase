from flask import Flask, request, jsonify
import mysql.connector
import os
import hashlib
import hmac
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get('DB_PASS'),
  database="dubiousdb"
)

def hash_password(password: str):
  salt = os.urandom(16)
  hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 110000)
  return hashed, salt

def check_password(hashed: bytes, password: str, salt: bytes) -> bool:
  check_password_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 110000)

  if check_password_hash == hashed:
    return True
  else:
    return False
  # return hmac.compare_digest(hashed, hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 110000))

@app.route('/api/register', methods=['POST'])
def register():
  username = request.json['username']
  password = request.json['password']
  email = request.json['email']
  first_name = request.json['first_name']
  last_name = request.json['last_name']

  cursor = db.cursor()
  hashed_password, salt = hash_password(password)

  try:
    sql = "INSERT INTO user (userName, passWord, passSalt, email, firstName, lastName) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (username, hashed_password, salt, email, first_name, last_name)
    cursor.execute(sql, values)

    db.commit()
  except Exception as e:
    print(e)
    return jsonify({ "message": "User already exists with username or email." }), 401

  print(f"{cursor.rowcount} record{'' if cursor.rowcount == 1 else 's'} inserted.")
  return "SUCCESS"

@app.route('/api/login', methods=["POST"])
def login():
  username = request.json['username']
  password = request.json['password']

  cursor = db.cursor()

  try:
    sql = "SElECT passWord, passSalt FROM (user) WHERE userName= %s"
    values = (username,)
    cursor.execute(sql, values)
    
    result = cursor.fetchone()
    
    if result == None:
      return jsonify({ "message:":"Invalid credentials" }), 401
    
    # Result in order of SELECT statement
    db_password, db_salt = result
    
    if check_password(db_password, password, db_salt):
      return jsonify({ "username": username })
    else:
      return jsonify({ "message":"Invalid credentials."}), 401
    
  except Exception as e:
    print(e)
    return jsonify({ "status":"failed", "error":"AN EXCEPTION OCCURED." })

@app.route('/api/logout')
def logout():
  return jsonify({ "status":"success", "message":"Successfully logged out." })

if __name__ == '__main__':
    app.run(port=5000)
