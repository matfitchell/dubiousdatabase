### EXPECTED OUTPUTS

#### Item categories
```
Item 1 - Samsung, Cellphone
Item 2 - Laptop
Item 3 - Gaming, Console
Item 4 - Camera 
Item 5 - Laptop
Item 6 - Headphones
Item 7 - Gaming, Console
Item 8 - Cellphone, Case, Samsung
Item 9 - Gaming, Console
Item 10 - Apple, Cellphone
```

#### 1

- Output:
```
    Id: 10
    Category: Apple
    Title: iPhone 13
    Price: $600
    Id: 4
    Category: Camera
    Title: Canon EOS R5
    Price: $3000
    Id: 8
    Category: Case
    Title: Samsung Galaxy S22 Case
    Price: $25
    Id: 1
    Category: Cellphone
    Title: Samsung Galaxy S22 Ultra
    Price: $1300
    Id: 3
    Category: Console
    Title: Sony PlayStation 5 Pro
    Price: $450
    Id: 3
    Category: Gaming
    Title: Sony PlayStation 5 Pro
    Price: $450
    Id: 6
    Category: Headphones
    Title: Wireless Headphones
    Price: $250
    Id: 2
    Category: Laptop
    Title: MacBook Pro 2023
    Price: $2000
    Id: 1
    Category: Samsung
    Title: Samsung Galaxy S22 Ultra
    Price: $1300
```

#### 2

Users who posted at least `2` Items that were posted on the same day. One has a category X and another has category Y.

- Input: `Laptop` and `Headphones`
   - Output: `Michael`

- Input: `Console` and `Headphones`
   - Output: `Michael`

- Input: `Case` and `Cellphone`
   - Output: `John`

#### 3

All items posted by user X, where all comments are good or excellent for those items.

- Input: `Michael`
   - Output: 3 items

- Input: `Alice`
   - Output: 1 item

- Input: `John`
   - Output: None


#### 4

All users who posted most number of items on a specific date:

- Input: `2023-08-29`
- Output: `Michael`

- Input: `2023-11-04`
- Output: `John`


#### 5

Users who are favorited by both users X and Y.
```
X = Alice Y = John
C = Bob, Emma

X = Emma Y = Bob
C = Michael

X = Michael Y = Emma
C = Bob

X = Michael Y = Alice
C = Bob
```

#### 6

Users who never posted any excellent items.
- Output: Everyone but Michael.

#### 7

Users who never posted a poor review.
- Output: Everyone but Alice.

#### 8

Users who posted some reviews, but each of them is poor
- Output: Alice

#### 9

Users who have posted items and none of their items have received poor reviews

- Output: Alice, Emma, Michael

#### 10

User pair such that each user gave the others' items only positive reviews

- Output: Bob, John