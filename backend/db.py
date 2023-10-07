from flask import Flask
import mysql.connector
import os

app = Flask(__name__)
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get('DB_PASS')
)

@app.route('/api/')
def users():
    return 'hi'

if __name__ == '__main__':
    app.run(debug=True)
