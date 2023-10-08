from flask import Flask, request
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

def hash_password(password: str) -> bytes:
  hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), 110000)
  return hashed

def check_password(hashed: bytes, password: str) -> bool:
  return hmac.compare_digest(hashed, hashlib.pbkdf2_hmac("sha256", password.encode(), 110000))

@app.route('/api/register', methods = ['POST'])
def register():
  username = request.args.get('username', type = str)
  password = request.args.get('password', type = str)
  email = request.args.get('email', type = str)
  first_name = request.args.get('first_name', type = str)
  last_name = request.args.get('last_name', type = str)

  cursor = db.cursor()
  hashed_password = hash_password(password)

  try:
    sql = "SElECT INTO user (userName, passWord, email, firstName, lastName) VALUES (%s, %s, %s, %s, %s)"
    values = (username, hashed_password.hexdigest(), email, first_name, last_name)
    cursor.execute(sql, values)

    db.commit()
  except Exception as e:
    print(e)
    return "FAILED"

  print(f"{cursor.rowcount} record{"" if cursor.rowcount == 1 else "s"} inserted.")
  return "SUCCESS"

@app.route('/api/login', methods=["POST"])
def login():
  username = request.args.get('username', type = str)
  password = request.args.get('password', type = str)

  cursor = db.cursor()

  try:
    sql = "SElECT passWord FROM (user) WHERE userName=(\"%s\")"
    values = (username)
    cursor.execute(sql, values)

    db.commit()
  except Exception as e:
    print(e)
    return {"status":"failed", "error": "AN EXCEPTION OCCURED"}
  if str(cursor) == None or password == None:
    print("Username doesn't exist")
    return {"status":"failed", "error": "INVALiD CREDENTIALS"}
  status = "succeed" if check_password(str(cursor), password) else "failed"
  print(status)
  return {"status":status}

@app.route('/api/logout')
def logout():
  return "Session closed", 401

if __name__ == '__main__':
    app.run(debug=True)
