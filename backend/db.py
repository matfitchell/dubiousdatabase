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
  # password=os.environ.get("DB_PASS"),
  password="password",
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


@app.route('/api/initializeDb', methods=["GET"])
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
    
    itemCreate = """
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

    purchaseCreate = """
    CREATE TABLE purchase (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      itemId int NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (itemId) REFERENCES item(itemId)
    )
    """

    favoriteSellerCreate = """
    CREATE TABLE favoriteSeller (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      favoriteUsername varchar(255) NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (favoriteUsername) REFERENCES user(username)
    )
    """
    
    favoriteItemCreate = """
    CREATE TABLE favoriteItem (
      id int NOT NULL AUTO_INCREMENT,
      username varchar(255) NOT NULL,
      itemId int NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (username) REFERENCES user(username),
      FOREIGN KEY (itemId) REFERENCES item(itemId)
    )
    """

    cursor.execute(itemCreate)
    cursor.execute(categoryCreate)
    cursor.execute(categoryToItemCreate)
    cursor.execute(reviewCreate)
    cursor.execute(purchaseCreate)
    cursor.execute(favoriteSellerCreate)
    cursor.execute(favoriteItemCreate)

    testItemsData = """INSERT INTO item (itemId, username, itemTitle, itemDesc, itemPrice, placeDate, bought)
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
    testCategoryData = """INSERT INTO category(title) VALUES
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
    testCategoryToItemData = """
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
    testReviewData = """
    INSERT INTO review(itemId, username, rating, description, date)
    VALUES
    (3, 'Alice', 3, 'Arrived broken!', DATE('2023-11-05')),
    (8, 'Alice', 3, 'terrible product.', DATE('2023-11-10')),
    (5, 'Bob', 0, 'truly amazing', DATE('2023-09-21')),
    (6, 'Emma', 0, 'greatest product I have ever received', DATE('2023-10-14')),
    (9, 'Bob', 0, 'WOW!', DATE('2023-09-01')),
    (4, 'John', 1, 'cured cancer, but could have been better', DATE('2023-11-10'));
    """

    testPurchaseData = """
    INSERT INTO purchase(username, itemId)
    VALUES
    ('Alice', 3),
    ('Alice', 8),
    ('Bob', 9)
    """

    testFavorites = """
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

    cursor.execute(testItemsData)
    cursor.execute(testCategoryData)
    cursor.execute(testCategoryToItemData)
    cursor.execute(testReviewData)
    cursor.execute(testPurchaseData)
    cursor.execute(testFavorites)

    db.commit()

    response =    {
      "message":"Database initialized"
    }

    return jsonify(response)
  except Exception as e:
    print(e)
  errorResponse = {
    "status":"failed", 
    "error":"AN EXCEPTION OCCURED." 
  }
  return jsonify(errorResponse), 500


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
    itemQuery = "SELECT COUNT(*) FROM item WHERE username = %s AND placeDate = CURDATE()"
    values = (username,)
    cursor.execute(itemQuery, values)
    itemCount = cursor.fetchone()[0]
    print(f"itemCount: {itemCount}")

    if itemCount is not None and itemCount >= 3:
      return jsonify({ "message":"Too many items inserted today."}), 400

    sql = "INSERT INTO item (username, itemTitle, itemDesc, itemPrice, placeDate, bought) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (username, title, desc, price, today_sql, bought) 
    cursor.execute(sql, values)

    db.commit()

    id = cursor.lastrowid
    print(f"Item ID: {id}")

    insertedItem = {
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
    
    errorResponse = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(errorResponse), 500
  
  return jsonify(insertedItem)


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

    errorResponse = {
      "status":"failed", 
      "error":"AN EXCEPTION OCCURED." 
    }
    return jsonify(errorResponse), 500

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
  
@app.route('/api/reviewItem', methods=["POST"])
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

@app.route('/api/two?category1=<cat1>&category2=<cat2>', methods = ["GET"])
def two_item_one_day():
  foramtted_list: list = []
  cursor = db.cursor()

  X = request.json['cat1']
  Y = request.json['cat2']
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

app.route('/api/three?username=<username>', methods = ['GET'])
def positive_comments():
  foramtted_list: list = []
  cursor = db.cursor()

  try:
    user = request.args["user"]
    #done
    query = """
    SELECT
        i.itemId,
        i.itemTitle,
        i.itemDesc,
        i.itemPrice,
        i.bought,
        GROUP_CONCAT(DISTINCT c.title) AS category
    FROM
        item i
        JOIN categorytoitem itc ON i.itemId = itc.itemId
        JOIN category c ON itc.itemId = c.title
        JOIN review co ON i.itemId = co.itemId
        LEFT JOIN review cr ON co.reviewId = cr.reviewId
    WHERE
        cr.rating IS NULL OR cr.rating NOT IN (0, 1, 2)
    GROUP BY
        i.itemId, i.itemTitle, i.itemDesc, i.itemPrice, i.bought;


    """
    cursor.execute(query, user)
    result = cursor.fetchall()
    print(f"result: {result}")

    for e in result:
      item = {
        "id":           e[0],
        "title":        e[1],
        "Description":  e[2],
        "price" :       e[3],
        "bought" :      e[4]
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


app.route('/api/four')
def most_items_on_date():
  cursor = db.cursor()
  date = request.json['placeDate']

  try:
    #done
    query = """
   SELECT
        u.username,
        COUNT(i.itemId) AS num_items_posted
    FROM
        user u
        JOIN item i ON u.username = i.username
    WHERE
        DATE(i.placeDate) = %s
    GROUP BY
        u.username
    ORDER BY
        num_items_posted DESC
    LIMIT 1;

    """

    cursor.execute(query, date)
    db.commit()
  
  except Exception as e:
    print(e)
    print(traceback.format_exc())

    response = {
          "status":"failed", 
          "error":"AN EXCEPTION OCCURED." 
        }
    return jsonify(response), 500
  

app.route('/api/five?user1=<x>&user2=<y>', methods = ["GET"])
def mutual_favs():
  foramtted_list: list = []
  cursor = db.cursor()

  user1 = request.json["x"]
  user2 = request.json["y"]
  values = (user1, user2)
  #query done
  try:
    query = """
            SELECT
                u.username
            FROM
                user u
                JOIN favoriteseller f1 ON u.username = f1.username
                JOIN favoriteseller f2 ON u.username = f2.username
            WHERE
                f1.username = %s
                AND f2.username = %s
                AND u.username NOT IN (f1.username, f2.username);
        """
    
    cursor.execute(query, values)
    result = cursor.fetchall()
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
if __name__ == '__main__':
  app.run(port=5000)