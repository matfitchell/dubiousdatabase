# Database Project

## Phase 1

### Usage

#### Prerequisites
- Python3
- Node

#### Start the backend app
1. Open backend folder and install dependencies using the following commands in the terminal:
   - `python3 -m pip install flask`
   - `python3 -m pip install flask-cors`
   - `python3 -m pip install mysql-connector-python`

2. Ensure db exists called "dubiousdb"
3. Set the `DB_PASS` environment variable to your MySQL root password.
4. Start the backend app using the following command in the terminal:
    ```
    python3 db.py
    ```

#### Start the web page
1. Open `comp440-app` folder and install dependencies by running:
```
npm install
```
2. Run the app using the command:
```
npm run dev
```

#### Contributions
Alisha A
- Changed front-end frameworks to ReactJS and NextJS. Used Material UI for the reusable components.
- Helped out with testing/implementing each backend endpoint.
- Implemented the endpoint to initialize certain database tables and populate them with test data.
- Implemented endpoints to get purchases, purchase items, get favorite sellers, get inserted items, and search through items.

Jonathan N
- Set up the back-end web app
- Created the routes (login, logout, and register) and password hashing.
- Helped with creating other backend routes and miscelaneous functionality
- Implemented the review backend route
- Implemented endpoints for requirements 6-10
- Impelemtned endpoints for deleting and adding favorite sellers
- Implemented endpoints for getting, deleting, and adding favorite items

Mitchell M
- Implemented backend for item insertion 
- Implemented backend for search by category
- Greatly assisted by teammates, helped with additonal components//teammates where possible 
