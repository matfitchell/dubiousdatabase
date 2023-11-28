from flask import Flask, request, jsonify
import mysql.connector
import os
import hashlib
import hmac
import traceback
from flask_cors import CORS
from datetime import date




app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get("DB_PASS"),
  database="dubiousdb"
)

globalCursor = db.cursor()

# Drop user table if it exists
globalCursor.execute("DROP TABLE IF EXISTS `review`")
globalCursor.execute("DROP TABLE IF EXISTS `categoryToItem`")
globalCursor.execute("DROP TABLE IF EXISTS `purchase`")
globalCursor.execute("DROP TABLE IF EXISTS `favoriteItem`")
globalCursor.execute("DROP TABLE IF EXISTS `item`")
globalCursor.execute("DROP TABLE IF EXISTS `favoriteSeller`")
globalCursor.execute("DROP TABLE IF EXISTS `category`")
globalCursor.execute("DROP TABLE IF EXISTS `user`")

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
testUserData = """INSERT INTO user (username, passWord, passSalt, email, firstName, lastName)
VALUES
('John', 0x70617373776F726431, 0x73616C7431, 'john@example.com', 'John', 'Doe'),
('Alice', 0x70617373776F726432, 0x73616C7432, 'alice@example.com', 'Alice', 'Smith'),
('Bob', 0x70617373776F726433, 0x73616C7433, 'bob@example.com', 'Bob', 'Johnson'),
('Emma', 0x70617373776F726434, 0x73616C7434, 'emma@example.com', 'Emma', 'Wilson'),
('Michael', 0x70617373776F726435, 0x73616C7435, 'michael@example.com', 'Michael', 'Brown');
"""

globalCursor.execute(sqlCreate)
globalCursor.execute(testUserData)
globalCursor.close()

# Enums for ratings
ratings = {
  "excellent": 0,
  "good": 1,
  "fair": 2,
  "poor": 3
}

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

  cursor = db.cursor()

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
    return jsonify(response), 400

  print(f"{cursor.rowcount} record{'' if cursor.rowcount == 1 else 's'} inserted.")

  response = {
    "message": "User successfully registered."
  }
  return jsonify(response)


@app.route('/api/login', methods=["POST"])
def login():
  username = request.json['username']
  password = request.json['password']

  cursor = db.cursor()

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
      return jsonify(response), 400
    
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
      return jsonify(response), 400
    
  except Exception as e:
    print(e)
    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500


@app.route('/api/logout')
def logout():
  response = {
    "message":"Successfully logged out." 
  }
  return jsonify(response)


@app.route('/api/initializeDb', methods=['GET'])
def initializeDb():
  cursor = db.cursor()

  try:
    cursor.execute("DROP TABLE IF EXISTS `review`")
    cursor.execute("DROP TABLE IF EXISTS `categoryToItem`")
    cursor.execute("DROP TABLE IF EXISTS `purchase`")
    cursor.execute("DROP TABLE IF EXISTS `favoriteItem`")
    cursor.execute("DROP TABLE IF EXISTS `item`")
    cursor.execute("DROP TABLE IF EXISTS `favoriteSeller`")
    cursor.execute("DROP TABLE IF EXISTS `category`")
    
    item_table = """
      CREATE TABLE item (
        itemId int NOT NULL AUTO_INCREMENT,
        username varchar(255) NOT NULL,
        itemTitle varchar(255) NOT NULL,
        itemDesc varchar(255) NOT NULL,
        itemPrice int NOT NULL,
        placeDate DATE NOT NULL,
        bought BOOLEAN NOT NULL,
        PRIMARY KEY (itemId),
        FOREIGN KEY (username) REFERENCES user(username)
      )
    """
    category_table = """
      CREATE TABLE category (
        title varchar(255) NOT NULL,
        PRIMARY KEY(title)
      )
    """
    category_to_item_table = """
      CREATE TABLE categoryToItem(
        matchId int NOT NULL AUTO_INCREMENT,
        itemId int NOT NULL,
        categoryTitle varchar(255) NOT NULL,
        PRIMARY KEY (matchId),
        FOREIGN KEY (categoryTitle) REFERENCES category(title),
        FOREIGN KEY (itemId) REFERENCES item(itemId)
      )
    """
    review_table = """
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
    purchase_table = """
    CREATE TABLE purchase (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      itemId int NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (itemId) REFERENCES item(itemId)
    )
    """
    favorite_seller_table = """
    CREATE TABLE favoriteSeller (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      favoriteUsername varchar(255) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (favoriteUsername) REFERENCES user(username)
    )
    """
    favorite_item_table = """
    CREATE TABLE favoriteItem (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      itemId int NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (itemId) REFERENCES item(itemId)
    )
    """

    cursor.execute(item_table)
    cursor.execute(category_table)
    cursor.execute(category_to_item_table)
    cursor.execute(review_table)
    cursor.execute(purchase_table)
    cursor.execute(favorite_seller_table)
    cursor.execute(favorite_item_table)

    test_items = """INSERT INTO item (itemId, username, itemTitle, itemDesc, itemPrice, placeDate, bought)
    VALUES
    (1, 'John', 'Samsung Galaxy S22 Ultra', 'Powerful Galaxy S22 Ultra.', 130000, DATE('2023-11-04'), false),
    (2, 'Alice', 'MacBook Pro 2023', 'The latest MacBook Pro with advanced features.', 200000, DATE('2023-12-01'), false),
    (3, 'Bob', 'Sony PlayStation 5 Pro', 'Experience gaming like never before with PS5 Pro.', 45000, DATE('2023-03-16'), true),
    (4, 'Emma', 'Canon EOS R5', 'A professional-grade mirrorless camera for photographers.', 300000, DATE('2023-11-04'), false),
    (5, 'Michael', 'Dell XPS 15 Laptop', 'Powerful performance in a sleek design.', 140000, DATE('2023-08-29'), false),
    (6, 'Michael', 'Wireless Headphones', 'High-quality headphones without the wires.', 25000, DATE('2023-08-29'), false),
    (7, 'Emma', 'Nintendo Switch', 'Lightweight, compact, and fun for the whole family.', 29999, DATE('2023-11-16'), false),
    (8, 'John', 'Samsung Galaxy S22 Case', 'Great, strong case in the color Red.', 2500, DATE('2023-11-04'), true),
    (9, 'Michael', 'Xbox Series S', 'The latest Xbox with next-gen speed and performance.', 34999, DATE('2023-08-29'), true),
    (10, 'Emma', 'iPhone 13', 'Great phone in the color Midnight.', 60000, DATE('2023-10-09'), false);  
    """ 
    test_categories = """INSERT INTO category(title) VALUES
    ('Samsung'),
    ('Cellphone'),
    ('Android'),
    ('Laptop'),
    ('Apple'),
    ('MacBook'),
    ('Gaming'),
    ('Console'),
    ('Sony'),
    ('Camera'),
    ('Photography'),
    ('Canon'),
    ('Dell'),
    ('Windows'),
    ('Headphones'),
    ('Nintendo'),
    ('Case'),
    ('Xbox');
    """
    test_category_to_items = """
    INSERT INTO categoryToItem (categoryTitle, itemID)
    VALUES
    ('Samsung', 1),
    ('Cellphone', 1),
    ('Android', 1),
    ('Laptop', 2),
    ('Apple', 2),
    ('MacBook', 2),
    ('Gaming', 3),
    ('Console', 3),
    ('Sony', 3),
    ('Camera', 4),
    ('Photography', 4),
    ('Canon', 4),
    ('Laptop', 5),
    ('Dell', 5),
    ('Windows', 5),
    ('Headphones', 6),
    ('Gaming', 7),
    ('Console', 7),
    ('Nintendo', 7),
    ('Samsung', 8),
    ('Cellphone', 8),
    ('Case', 8),
    ('Gaming', 9),
    ('Console', 9),
    ('Xbox', 9),
    ('Apple', 10),
    ('Cellphone', 10);
    """ 
    test_reviews = """
    INSERT INTO review(itemId, username, rating, description, date)
    VALUES
    (3, 'Alice', 3, 'Arrived broken!', DATE('2023-11-05')),
    (1, 'Alice', 3, 'Awful!', DATE('2023-12-04')),
    (8, 'Alice', 3, 'terrible product.', DATE('2023-11-10')),
    (5, 'Bob', 0, 'truly amazing', DATE('2023-09-21')),
    (5, 'John', 0, 'perfect', DATE('2023-04-11')),
    (5, 'Emma', 0, 'innovative', DATE('2023-02-01')),
    (1, 'Bob', 0, 'Amazing!', DATE('2023-12-04')),
    (3, 'John', 0, 'Superb!', DATE('2023-12-04')),
    (6, 'Emma', 0, 'greatest product I have ever received', DATE('2023-10-14')),
    (9, 'Bob', 0, 'WOW!', DATE('2023-09-01')),
    (4, 'John', 1, 'cured cancer, but could have been better', DATE('2023-11-10'));
    """
    test_purchases = """
    INSERT INTO purchase(username, itemId)
    VALUES
    ('Alice', 3),
    ('Alice', 8),
    ('Bob', 9)
    """
    test_seller_favs = """
    INSERT INTO favoriteSeller(username, favoriteUsername) VALUES
    ('Alice', 'Bob'),
    ('John', 'Bob'),
    ('Alice', 'Emma'),
    ('John', 'Emma'),
    ('Emma', 'Bob'),
    ('Bob', 'Emma'),
    ('Emma', 'Michael'),
    ('Bob', 'Michael'),
    ('Michael', 'Bob');
    """

    test_item_favs = """
    INSERT INTO favoriteItem(username, itemId) VALUES
    ('Alice', 6),
    ('Alice', 7),
    ('Bob', 2),
    ('Bob', 10);
    """

    cursor.execute(test_items)
    cursor.execute(test_categories)
    cursor.execute(test_category_to_items)
    cursor.execute(test_reviews)
    cursor.execute(test_purchases)
    cursor.execute(test_seller_favs)
    cursor.execute(test_item_favs)

    db.commit()

    response = {
      "message":"Database initialized"
    }

    return jsonify(response)
  except Exception as e:
    print(e)

    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500


@app.route('/api/insertItem', methods=['POST'])
def insertItem():
  username = request.json['username']
  title = request.json['title']
  desc  = request.json['desc']
  categories = request.json['categories']
  price = request.json['price']
  bought = bool(False)
  placeDate = date.today()

  today_sql = f"{placeDate.year}-{placeDate.month}-{placeDate.day}"
  
  cursor = db.cursor()

  try:
    item_query = "SELECT COUNT(*) FROM item WHERE username = %s AND placeDate = CURDATE()"
    values = (username,)
    cursor.execute(item_query, values)
    item_count = cursor.fetchone()[0]
    print(f"itemCount: {item_count}")

    if item_count is not None and item_count >= 3:
      return jsonify({ "message":"Too many items inserted today."}), 400

    sql = "INSERT INTO item (username, itemTitle, itemDesc, itemPrice, placeDate, bought) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (username, title, desc, price, today_sql, bought) 
    cursor.execute(sql, values)

    db.commit()

    id = cursor.lastrowid
    print(f"Item ID: {id}")

    inserted_item = {
      "id": id,
      "title": title,
      "desc": desc,
      "categories": categories,
      "price": price
    }

    for e in categories:  
      sql = "SELECT * FROM category WHERE title = %s"
      values = (e,)
      cursor.execute(sql,values)
      found = cursor.fetchone()

      if found is None:
        sql = "INSERT INTO category(title) VALUES (%s)"
        values = (e,)
        cursor.execute(sql,values)
      
      sql = "INSERT INTO categoryToItem(itemId, categoryTitle) VALUES (%s,%s)"
      values = (id,e)
      cursor.execute(sql,values)

      db.commit()
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    
    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500
  
  return jsonify(inserted_item)


@app.route('/api/buyItem', methods=['POST'])
def buyItem():
  username = request.json['username']
  itemId = request.json['itemId']

  cursor = db.cursor()

  try:
    query = "SELECT * FROM purchase WHERE username = %s AND itemId = %s"
    values = (username, itemId)
    cursor.execute(query, values)
    result = cursor.fetchone()

    if result != None:
      response = {
        "message":"Item has already been purchased."
      }
      return jsonify(response), 400

    query = "INSERT INTO purchase(username, itemId) VALUES (%s, %s)"
    values = (username, itemId)
    cursor.execute(query, values)

    query = "UPDATE item SET bought = true WHERE itemId = %s"
    cursor.execute(query, (itemId,))

    db.commit()

    response = {
      "message": "Item successfully purchased."
    }
    return jsonify(response)
  except Exception as e:
    print(e)

    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500


@app.route('/api/purchases', methods=['GET'])
def purchases():
  formatted_list: list = []

  cursor = db.cursor()

  try:
    username = request.args["username"]
    query = "SELECT itemId FROM purchase WHERE username = %s"
    cursor.execute(query, (username,))
    item_ids = cursor.fetchall()

    item_ids = [x[0] for x in item_ids]

    for id in item_ids:
      query = "SELECT itemTitle, itemDesc, itemPrice, username FROM item WHERE itemId = %s"
      cursor.execute(query, (id,))
      item_result = cursor.fetchone()

      query = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %s"
      cursor.execute(query, (id,))
      category_titles = cursor.fetchall()

      categories = [x[0] for x in category_titles]

      formatted_item = {
        "id": id,
        "title": item_result[0],
        "desc": item_result[1],
        "price": item_result[2],
        "seller": item_result[3],
        "categories": categories
      }

      formatted_list.append(formatted_item)

    return jsonify(formatted_list)
  except Exception as e:
    print(e)
    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500
  

@app.route('/api/items', methods=['GET'])
def items():
  formatted_list: list = []

  cursor = db.cursor()

  try:
    username = request.args["username"]
    query = "SELECT itemId, itemTitle, itemDesc, itemPrice FROM item WHERE username = %s"
    cursor.execute(query, (username,))
    items = cursor.fetchall()

    for item in items:
      query = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %s"
      cursor.execute(query, (item[0],))
      # Returns pairs ex: [(string,), ...]
      category_titles = cursor.fetchall()

      # Get categories as strings from pairs
      categories = [x[0] for x in category_titles]

      formatted_item = {
        "id": item[0],
        "title": item[1],
        "desc": item[2],
        "categories": categories,
        "price": item[3]
      }

      formatted_list.append(formatted_item)

    return jsonify(formatted_list)
  except Exception as e:
    print(e)
    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500


@app.route('/api/search', methods=['GET'])
def search():
  foramtted_list: list = []

  cursor = db.cursor()
  
  try:
    term = request.args["term"]
    query = "SELECT itemId FROM categoryToItem WHERE categoryTitle = %s"
    cursor.execute(query, (term,))
    ids = cursor.fetchall()

    print(f"ids: {ids}")

    for id in ids:

      sql = "SELECT itemTitle, itemDesc, itemPrice FROM item WHERE itemId = %s"
      values = (id[0],)
      cursor.execute(sql,values)
      result = cursor.fetchall()[0]
      print(f"result: {result}")

      sql = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %s"
      values = (id[0],)
      cursor.execute(sql,values)
      categoryTitles = cursor.fetchall()
      categories = [x[0] for x in categoryTitles]
      print(f"categories: {categories}")

      item = {
        "id": id[0],
        "title": result[0],
        "desc" : result[1],
        "price" : result[2],
        "categories" : categories 
        } 
      
      print(f"item to send: {item}")
      foramtted_list.append(item)

    return jsonify(foramtted_list)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500

# Search endpoint that filters items inserted by user
@app.route('/api/searchFiltered', methods=['GET'])
def searchFiltered():
  foramtted_list: list = []

  cursor = db.cursor()
  
  try:
    username = request.args["username"]
    term = request.args["term"]
    query = "SELECT itemId FROM categoryToItem WHERE categoryTitle = %s"
    cursor.execute(query, (term,))
    ids = cursor.fetchall()

    print(f"ids: {ids}")

    for id in ids:
      sql = "SELECT itemTitle, itemDesc, itemPrice, username, bought FROM item WHERE itemId = %s AND username != %s"
      values = (id[0], username)
      cursor.execute(sql,values)
      result = cursor.fetchone()

      if result == None:
        continue

      sql = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %s"
      values = (id[0],)
      cursor.execute(sql,values)
      categoryTitles = cursor.fetchall()
      categories = [x[0] for x in categoryTitles]

      item = {
        "id": id[0],
        "title": result[0],
        "desc" : result[1],
        "price" : result[2],
        "username": result[3],
        "isBought": bool(result[4]),
        "categories" : categories 
        } 

      print(f"item {id} is: {item}")
      foramtted_list.append(item)

    return jsonify(foramtted_list)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500


@app.route('/api/reviewItem', methods=['POST'])
def review_item():
  item_id = request.json['itemId']
  username = request.json['username']
  rating = request.json['rating']
  desc = request.json['desc']

  cursor = db.cursor()

  try:
    today = date.today()
    today_sql = f"{today.year}-{today.month}-{today.day}"

    sql = "SElECT reviewId FROM review WHERE userName= %s and date= %s"
    values = (username,today_sql)
    cursor.execute(sql, values)

    # Gets next row; there will only be 1 from sql query
    result = cursor.fetchall()

    if result != None and len(result) >= 3:
      # User already submitted 3 reviews today
      response = {
        "message":"Too many reviews submitted today"
      }
      return jsonify(response), 400

    # note that reviewId is autoincremented, so we aren't inserting with it
    sql = "INSERT INTO review(itemId, userName, date, rating, description) VALUES (%s, %s, %s, %s, %s)"
    values = (item_id, username, today_sql, ratings[rating], desc)
    cursor.execute(sql, values)

    db.commit()
  except Exception as e:
    print(e)
    print(traceback.format_exc())
    
    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500
  
  return jsonify({ "message":"Review inserted."})

@app.route('/api/one', methods = ["GET"])
def getExpensive():

  foramtted_list: list = []
  cursor = db.cursor()
  try:
    #done
    query = """
    WITH RankedItems AS (
    SELECT
        i.itemId,
        i.itemTitle,
        i.itemPrice,
        c.title,
        ROW_NUMBER() OVER (PARTITION BY c.title ORDER BY i.itemPrice DESC) AS rank_within_category
    FROM
        item i
        JOIN categorytoitem ci ON i.itemID = ci.itemId
        JOIN category c ON ci.categoryTitle = c.title
    )
    SELECT
      itemId,
      itemTitle,
      itemPrice,
      title
    FROM
      RankedItems
    WHERE
      rank_within_category = 1;
    """
    cursor.execute(query)
    result = cursor.fetchall()
    print(f"result: {result}")

    for e in result:
      item = {
        "id":       e[0],
        "title" :   e[1],
        "price" :   e[2],
        "category": e[3]
      }

      print(f"Most Expensive Item: {item}")
      foramtted_list.append(item)
    
    return jsonify(foramtted_list)

  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500

@app.route('/api/two', methods = ["GET"])
def two_item_one_day():
  foramtted_list: list = []
  cursor = db.cursor()

  X = request.args['category1']
  Y = request.args['category2']
  values =(X, Y)
  
  try:
    #done
    query = """
    SELECT
      u.username
    FROM
        user u
        JOIN item i1 ON u.username = i1.username
        JOIN categorytoitem itc1 ON i1.itemId = itc1.itemId
        JOIN category c1 ON itc1.categoryTitle = c1.title
        JOIN item i2 ON u.username = i2.username
        JOIN categorytoitem itc2 ON i2.itemId = itc2.itemId
        JOIN category c2 ON itc2.categoryTitle = c2.title
    WHERE
        i1.placeDate = i2.placeDate
        AND i1.itemId <> i2.itemId
        AND c1.title = %s
        AND c2.title = %s;

    """
    cursor.execute(query,values)
    result = cursor.fetchall()
    print(f"result: {result}")

    for e in result:
      foramtted_list.append(e)

    return jsonify(foramtted_list)

  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500

@app.route('/api/three', methods = ['GET'])
def positive_comments():
  foramtted_list: list = []
  cursor = db.cursor()
  
  try:
    user = request.args["username"]
    #done
    query = """
    SELECT
        i.itemId,
        i.itemTitle,
        i.itemDesc,
        i.itemPrice,
        i.bought
    FROM
        item i
        JOIN review co ON i.itemId = co.itemId
        JOIN user u_posted ON i.username = u_posted.username
    WHERE
        (co.rating IS NULL OR co.rating IN (0, 1))
        AND u_posted.username = %s
    GROUP BY
        i.itemId, i.itemTitle, i.itemDesc, i.itemPrice, i.bought;
    """
    cursor.execute(query, (user,))
    result = cursor.fetchall()
    print(f"result: {result}")

    for e in result:
      item = {
        "id":           e[0],
        "title":        e[1],
        "desc":  e[2],
        "price" :       e[3],
      }
      foramtted_list.append(item)

    return jsonify(foramtted_list)
  
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500


@app.route('/api/four', methods = ['POST'])
def most_items_on_date():
  cursor = db.cursor()
  date = request.json['placeDate']
  print(f"date: {date}")
  formatted_list: list = []

  try:
    #done
    query = """
    WITH RankedUsers AS (
    SELECT
        u.username,
        COUNT(i.itemId) AS num_items_posted,
        RANK() OVER (ORDER BY COUNT(i.itemId) DESC) AS posting_rank
    FROM
        user u
        JOIN item i ON u.username = i.username
    WHERE
        DATE(i.placeDate) = %s
    GROUP BY
        u.username
      )
      SELECT
          username,
          num_items_posted
      FROM
          RankedUsers
      WHERE
          posting_rank = 1;"""

    cursor.execute(query, (date,))
    result = cursor.fetchall()

    for user in result:
      formatted_user = {
        "username": user[0],
        "count": user[1]
      }

      formatted_list.append(formatted_user)

    return jsonify(formatted_list)

  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500
  

@app.route('/api/five', methods = ["GET"])
def mutual_favs():
  formatted_list: list = []
  cursor = db.cursor()

  user1 = request.args["user1"]
  user2 = request.args["user2"]
  values = (user1, user2, user2, user1)
  #query done
  try:
    query = """
    SELECT DISTINCT fs1.favoriteUsername 
    FROM favoriteseller fs1 
    INNER JOIN favoriteseller fs2 ON fs1.favoriteUsername = fs2.favoriteUsername
    WHERE fs1.username = %s
    AND fs2.username = %s 
    AND fs1.favoriteUsername NOT IN (%s)
    AND fs2.favoriteUsername NOT IN (%s);
    """
    
    cursor.execute(query, values)
    result = cursor.fetchall()

    print(f"result in five: {result}")

    for user in result:
      formatted_list.append(user[0])

    return jsonify(formatted_list)

  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500

@app.route('/api/six', methods=["GET"])
def six():
  # Display all the users who never posted any "excellent" items: an item is excellent if at least
  # three reviews are excellent.
  cursor = db.cursor()

  try:
    sql = 'SELECT DISTINCT username FROM user WHERE username NOT IN(\
      SELECT DISTINCT username FROM item where itemId IN\
      (SELECT DISTINCT itemId FROM review WHERE rating = 0 GROUP BY itemId HAVING COUNT(*) > 2))'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(f"6 result: {result}")
    result = [x[0] for x in result]
    return jsonify(result)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/seven', methods=["GET"])
def seven():
  # Display all users who never posted a poor review
  cursor = db.cursor()

  try:
    sql = 'SELECT DISTINCT username FROM user WHERE username NOT IN (SELECT DISTINCT username FROM review WHERE rating = 3)'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(f"7 result: {result}")
    result = [x[0] for x in result]
    return jsonify(result)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/eight', methods=["GET"])
def eight():
  # Display all users who posted poor reviews
  cursor = db.cursor()

  try:
    sql = 'SELECT DISTINCT username FROM review WHERE username IN (SELECT DISTINCT username FROM review WHERE rating = 3)'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(f"8 result: {result}")
    result = [x[0] for x in result]
    return jsonify(result)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/nine', methods=["GET"])
def nine():
  # Display users where for all their items, none have received a poor rating
  cursor = db.cursor()

  try:
    sql = 'SELECT DISTINCT username FROM item WHERE itemId NOT IN (SELECT DISTINCT itemId FROM review WHERE rating = 3)'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(f"9 result: {result}")
    result = [x[0] for x in result]
    return jsonify(result)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/ten', methods=["GET"])
def ten():
  # List a user pair such that they always gave each other excellent reviews
  cursor = db.cursor()

  try:
    sql = 'SELECT DISTINCT R1.username, R2.username\
          FROM review R1 JOIN review R2\
          ON (SELECT username FROM item WHERE itemId = R1.itemId) = R2.username AND R1.username < R2.username\
          WHERE R1.rating = 0 AND R2.rating = 0;'
    cursor.execute(sql)
    result = cursor.fetchall()
    print(f"10 result: {result}")
    return jsonify(result[0])
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status":"failed",
      "error":"AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/sellers', methods=['GET'])
def sellers():
  sellers_list: list = []

  cursor = db.cursor()

  try:
    query = "SELECT username FROM user"
    cursor.execute(query)
    result = cursor.fetchall()

    for user in result:
      seller = {
        "username": user[0]
      }

      sellers_list.append(seller)

    return jsonify(sellers_list)
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
      "status": "failed",
      "error": "AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500


# Favorites endpoints below
@app.route('/api/item/favorites', methods=['POST'])
def itemFavorites():
  username = request.json["username"]

  formatted_list: list = []

  cursor = db.cursor()

  try:
    query = "SELECT itemId FROM favoriteItem WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchall()

    itemIds = [x[0] for x in result]

    for id in itemIds:
      query = "SELECT itemTitle, itemDesc, itemPrice, username FROM item WHERE itemId = %s"
      cursor.execute(query, (id,))
      item_result = cursor.fetchone()

      # Get categories
      query = "SELECT categoryTitle FROM categoryToItem WHERE itemId = %s"
      cursor.execute(query, (id,))
      result = cursor.fetchall()

      categories = [x[0] for x in result]

      formatted_item = {
        "id": id,
        "title": item_result[0],
        "desc": item_result[1],
        "price": item_result[2],
        "seller": item_result[3],
        "categories": categories
      }

      formatted_list.append(formatted_item)

    return jsonify(formatted_list)
  except Exception as e:
    print(e)
    response = {
      "status": "failed",
      "error": "AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500

@app.route('/api/seller/favorite', methods=['POST'])
def add_favorite_seller():
  username = request.json["username"]
  user_to_fav = request.json["userToFav"]

  cursor = db.cursor()
  try:
    query = "INSERT INTO favoriteSeller(username, favoriteUsername) VALUES (%s, %s)"
    cursor.execute(query, (username, user_to_fav))
    db.commit()
    return jsonify({"status": "success"})

  except Exception as e:
    print(e)
    response = {
      "status": "failed",
      "error": "AN EXCEPTION OCCURED."
    }
    return jsonify(response), 500

@app.route('/api/seller/favorites', methods=['POST'])
def sellerFavorite():
  username = request.json["username"]
  if "userToFav" in request.json:
    return add_favorite_seller(username, request.json["userToFav"])

  cursor = db.cursor()

  try:
    # Get favorite sellers for username
    query = "SELECT favoriteUsername FROM favoriteSeller WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchall()
    return jsonify(result)

  except Exception as e:
    print(e)
    response = {
      "status": "failed",
      "error": "AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500

@app.route('/api/seller/favorite', methods=['DELETE'])
def sellerFavoriteDelete():
  username = request.json["username"]
  user_to_del = request.json["userToDel"]

  cursor = db.cursor()

  try:
    query = "DELETE FROM favoriteSeller WHERE username = %s AND favoriteUsername = %s"
    cursor.execute(query, (username, user_to_del))
    result = cursor.fetchall()
    return jsonify(result)

  except Exception as e:
    print(e)
    response = {
      "status": "failed",
      "error": "AN EXCEPTION OCCURED." 
    }
    return jsonify(response), 500

if __name__ == '__main__':
  app.run(port=5000)