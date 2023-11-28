# Database Project

## Phase 1

### Usage

#### Prerequisites
- Python3

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
Open public/index.html or use the `Live Server` extension on VSCode to host the front-end on port 5500.

#### Contributions
Alisha A
- Created the front-end UI and functionality using HTML, CSS with Bootstrap, and Javascript.
- Helped out with testing/implementing each backend endpoint.
- Implemented the endpoint to initialize certain database tables and populate them with test data.

Jonathan N
- Set up the back-end web app
- Created the routes (login, logout, and register) and password hashing.
- Helped with creating other backend routes and miscelaneous functionality
- Implemented the review backend route

Mitchell M
- Implemented backend for item insertion 
- Implemented backend for search by category
- Greatly assisted by teammates, helped with additonal components//teammates where possible
-Implemented Phase 2 requirements 1-5 
