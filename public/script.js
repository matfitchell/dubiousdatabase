let user = "";

const API = "http://localhost:5000"

function start() {
    const registerLink = getElementById("registerLink");
    const loginLink = getElementById("loginLink");
    const logoutBtn = getElementById("logoutBtn");
    const searchNavBtn = getElementById("searchNavBtn");
    const insertNavBtn = getElementById("insertNavBtn");
    const initialDbNavBtn = getElementById("initialDbNavBtn");

    registerLink.addEventListener("click", displayRegisterForm);
    loginLink.addEventListener("click", displayLoginForm);
    logoutBtn.addEventListener("click", logoutClicked);
    searchNavBtn.addEventListener("click", displaySearchBar);
    insertNavBtn.addEventListener("click", displayInsertForm);
    initialDbNavBtn.addEventListener("click", initializeDb);

    const loginForm = getElementById("loginForm");
    const registerForm = getElementById("registerForm");
    const itemReviewForm = getElementById("itemReviewForm");
    const insertItemForm = getElementById("insertItemForm");

    loginForm.addEventListener("submit", loginFormSubmit);
    registerForm.addEventListener("submit", registerFormSubmit);
    itemReviewForm.addEventListener("submit", itemReviewFormSubmit);
    insertItemForm.addEventListener("submit", insertItemFormSubmit);


    //Form search button
    const searchBtn = getElementById("searchBtn");
    const cancelReviewBtn = getElementById("cancelReviewBtn");

    searchBtn.addEventListener("click", searchItems);
    cancelReviewBtn.addEventListener("click", closeReviewDivBtn);
}

async function logoutClicked() {
    setLoggedOut();

    try {
        const response = await fetch(API + '/api/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let jsonObj = await response.json();

        if (response.ok) {
            setLoggedOut();
            console.log(jsonObj.message);
        }
        else {
            console.log("ERROR: Something went wrong.")
        }
    } catch (err) {
        console.log(err);
    }
}

async function loginFormSubmit(e) {
    e.preventDefault(); //prevent browser from refreshing/using default submission

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;
    let userObj = { username: username, password: password };

    try {
        const response = await fetch(API + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        });

        if (response.ok) {
            let jsonObj = await response.json();
            resetErrorDiv();
            setLoggedIn(jsonObj.username);
        }
        else {
            let jsonObj = await response.json();
            setErrorDiv(jsonObj.message);
        }

    } catch (err) {
        console.log(err);
        setLoggedOut();
    }
}

async function registerFormSubmit(e) {
    e.preventDefault();

    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let passwordRe = document.getElementById("registerRePassword").value;
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let email = document.getElementById("registerEmail").value;

    let valid = true;

    if (password !== passwordRe) {
        setErrorDiv("Passwords do not match.")
        valid = false;
    }
    else {
        resetErrorDiv()
    }

    if (valid) {
        let userObj = { 
            username: username, 
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email,
        };

        try {
            const response = await fetch(API + "/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userObj)
            });

            if (response.ok) {
                //User will have to log in once they sign up successfully.
                setLoggedOut();
            }
            else {
                let jsonObj = await response.json();
                setErrorDiv(jsonObj.message);
            }
        } catch (err) {
            console.log(err);
            setLoggedOut();
        }
    }
}

async function initializeDb(e) {
    e.preventDefault();
    resetUserPage();

    try {
        const response = await fetch(API + "/api/initializeDb", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            let jsonObj = await response.json();
            setErrorDiv(jsonObj.message);
        }

    } catch (err) {
        console.log(err);
    }
}

async function insertItemFormSubmit(e) {
    e.preventDefault();
    
    let itemTitle = document.getElementById("itemTitle").value;
    let itemDesc = document.getElementById("itemDesc").value;
    let itemCategory = document.getElementById("itemCategory").value;
    let itemPrice = document.getElementById("itemPrice").value;

    //get categories in an array
    let categories = [];
    itemCategory.split(",").forEach(c => {
        c = c.trim();   //trim any spaces
        categories.push(c); //add category to array
    })

    //get price as an int
    let price = parseInt(parseFloat(itemPrice) * 100);

    let itemObj = {
        itemTitle: itemTitle,
        itemDesc: itemDesc,
        itemCategory: categories,
        itemPrice: price,
    };

    try {
        const response = await fetch(API + "/api/insertItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itemObj)
        });

        let jsonObj = await response.json();
        if (response.ok) {
            //Clear form so another item can be inserted.
            getElementById("insertItemForm").reset();
        }
        else {
            setErrorDiv(jsonObj.message);
        }

    } catch (err) {
        console.log(err)
    }
}

async function searchItems(e) {
    e.preventDefault();
    closeReviewDiv();

    let searchString = document.getElementById("searchString").value;
    // Create params to append to request url
    let params = new URLSearchParams ({
        term: searchString
    })

    try {
        const response = await fetch(API + `/api/search?${params}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        let jsonData = await response.json();
        if (response.ok) {
            displaySearchResult(jsonData.items);
        }
        else {
            setErrorDiv(jsonData.message);
        }

    } catch (err) {
        console.log(err)
    }

    // const testData = [
    //     {
    //         id: 1,
    //         title: "Item 1",
    //         desc: "Description for Item 1",
    //         price: 19.99,
    //         categories: ["Category A", "Category B"]
    //     },
    //     {
    //         id: 2,
    //         title: "Item 2",
    //         desc: "Description for Item 2",
    //         price: 29.99,
    //         categories: ["Category B", "Category C"]
    //     },
    //     {
    //         id: 3,
    //         title: "Item 3",
    //         desc: "Description for Item 3",
    //         price: 39.99,
    //         categories: ["Category A", "Category C"]
    //     },
    //     {
    //         id: 2,
    //         title: "Item 2",
    //         desc: "Description for Item 2",
    //         price: 29.99,
    //         categories: ["Category B", "Category C"]
    //     },
    //     {
    //         id: 3,
    //         title: "Item 3",
    //         desc: "Description for Item 3",
    //         price: 39.99,
    //         categories: ["Category A", "Category C"]
    //     },
    //     {
    //         id: 2,
    //         title: "Item 2",
    //         desc: "Description for Item 2",
    //         price: 29.99,
    //         categories: ["Category B", "Category C"]
    //     },
    //     {
    //         id: 3,
    //         title: "Item 3",
    //         desc: "Description for Item 3",
    //         price: 39.99,
    //         categories: ["Category A", "Category C"]
    //     },
    //     {
    //         id: 2,
    //         title: "Item 2",
    //         desc: "Description for Item 2",
    //         price: 29.99,
    //         categories: ["Category B", "Category C"]
    //     },
    //     // Add more test objects as needed
    // ];

    // displaySearchResult(testData);
}

//Takes list of json objects
async function displaySearchResult(result) {
    let listContainer = getElementById("listContainer");
    //Clear previous list contents before displaying new list
    listContainer.innerHTML = "";

    //Loop through each item in result and create a list item for it.
    result.forEach(item => {
        const itemElem = document.createElement("li");
        itemElem.id = `${item.id}`;
        itemElem.className = "list-group-item list-group-item-action";

        let price = parseFloat(item.price) / 100;   //Format price correctly

        //Set innerHTML details
        itemElem.innerHTML = `<h6>Title: <span>${item.title}</span></h6>
        Description: <span>${item.desc}</span>
        <br>
        Price: $<span>${price}</span>
        <br>
        Categories: `;

        //Put categories in spans with specific bootstrap classes.
        item.categories.forEach(category => {
            const categoryElem = document.createElement("span");
            categoryElem.className = "badge text-bg-secondary";
            categoryElem.innerHTML = category;
            //Append category span to the current list item
            itemElem.appendChild(categoryElem);
            itemElem.innerHTML += " ";
        });

        itemElem.addEventListener("click", () => {
            //Display a review form above for the current list item
            //Set item id and title in form
            getElementById("itemToReviewId").setAttribute("value", item.id);
            getElementById("itemToReviewTitle").setAttribute("value", item.title);
            display(getElementById("itemReviewDiv"));
        });
        
        //Append the list item to the list container
        listContainer.appendChild(itemElem);
    });
}

async function itemReviewFormSubmit(e) {
    e.preventDefault();

    let username = user;
    let itemId = getElementById("itemToReviewId").value;
    let itemRating = getElementById("itemRating").value;
    let reviewDesc = getElementById("itemReviewDesc").value;
    let valid = true;

    if (itemRating == "Choose a Rating") {
        setErrorDiv("Please select a rating.");
        value = false;
    } else {
        resetErrorDiv();
    }

    if (valid) {
        let reviewObj = {
            username: username,
            itemId: itemId,
            rating: itemRating,
            desc: reviewDesc,
        }
    
        try {
            const response = await fetch(API + "/api/reviewItem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reviewObj)
            });
    
            let jsonObj = await response.json();
            if (response.ok) {
                //close form
                closeReviewDiv();
            }
            else {
                setErrorDiv(jsonObj.message);
            }
    
        } catch (err) {
            console.log(err)
        }
    }
}

// HELPER FUNCTIONS BELOW
function closeReviewDivBtn(e) {
    //Prevent button from resetting page
    //reset will cause item list to disappear.
    e.preventDefault();

    closeReviewDiv();
}

function closeReviewDiv() {
    resetErrorDiv();
    getElementById("itemReviewForm").reset();
    hide(getElementById("itemReviewDiv"));
}

function displaySearchBar() {
    resetErrorDiv();
    getElementById("listContainer").innerHTML = "";
    hide(getElementById("insertItemDiv"));
    display(getElementById("searchItemDiv"));
}

function displayInsertForm() {
    resetErrorDiv();
    getElementById("insertItemForm").reset();
    hide(getElementById("searchItemDiv"));
    display(getElementById("insertItemDiv"));
}

function displayLoginForm() {
    resetErrorDiv();
    getElementById("loginForm").reset();  //clear form
    hide(getElementById("registerFormDiv"));
    display(getElementById("loginFormDiv"));
}

function displayRegisterForm() {
    resetErrorDiv();
    getElementById("registerForm").reset();  //clear form
    hide(getElementById("loginFormDiv"));
    display(getElementById("registerFormDiv"));
}

function resetUserPage() {
    resetErrorDiv();
    getElementById("listContainer").innerHTML = "";
    closeReviewDiv();
    hide(getElementById("searchItemDiv"));
    hide(getElementById("insertItemDiv"));
}

//Sets screen to user view with logout button
function setLoggedIn(username) {
    resetErrorDiv();    //Clear any remaining errors
    resetUserPage();    //Reset user page so only buttons show initially

    user = username;
    hide(getElementById("loginFormDiv"));
    display(getElementById("welcomeDiv"));
    getElementById("username").innerHTML = username;
}

//Sets screen to guest view; shows main navigation buttons
function setLoggedOut() {
    resetErrorDiv();    //Clear remaining errors
    resetUserPage();    //Reset user page
    
    user = "";
    hide(getElementById("welcomeDiv"));
    displayLoginForm();
    getElementById("username").innerHTML = "";
}

//Sets the error div to any error messages received
function setErrorDiv(error) {
    getElementById("errorDiv").setAttribute("class", "alert alert-danger");
    getElementById("errorDiv").innerHTML = error;
}

//Hides error div and resets innerHTML content
function resetErrorDiv() {
    hide(getElementById("errorDiv"));
    getElementById("errorDiv").innerHTML = "";
}

//Simplify getting elements
function getElementById(id) {
    return document.getElementById(id);
}

//Helper functions to hide/display elements
function hide(element) {
    element.setAttribute("class", "invisible");
}

function display(element) {
    element.setAttribute("class", "visible");
}

window.addEventListener("load", start);