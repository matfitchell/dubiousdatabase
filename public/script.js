const API = "http://localhost:5000"

function start() {
    const registerLink = getElementById("registerLink");
    const loginLink = getElementById("loginLink");
    const logoutBtn = getElementById("logoutBtn");

    registerLink.addEventListener("click", displayRegisterForm);
    loginLink.addEventListener("click", displayLoginForm);
    logoutBtn.addEventListener("click", logoutClicked)

    const loginForm = getElementById("loginForm");
    const registerForm = getElementById("registerForm");

    loginForm.addEventListener("submit", loginFormSubmit);
    registerForm.addEventListener("submit", registerFormSubmit);
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

async function initializeDb() {
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

async function insertItem(e) {
    e.preventDefault();
    
    let itemTitle = document.getElementById("itemTitle").value;
    let itemDesc = document.getElementById("itemDesc").value;
    let itemCategory = document.getElementById("itemCategory").value;
    let itemPrice = document.getElementById("itemPrice").value;

    let itemObj = {
        itemTitle: itemTitle,
        itemDesc: itemDesc,
        itemCategory: itemCategory,
        itemPrice: itemPrice,
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
            //Show success message?
        }
        else {
            setErrorDiv(jsonObj.message);
        }

    } catch (err) {
        console.log(err)
    }
}

async function searchItems() {
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
            // parse data into list
        }
        else {
            setErrorDiv(jsonData.message);
        }

    } catch (err) {
        console.log(err)
    }
}

//Sets screen to user view with logout button
function setLoggedIn(username) {
    resetErrorDiv() //clear any errors
    hide(getElementById("loginFormDiv"));
    display(getElementById("welcomeDiv"));
    getElementById("username").innerHTML = username;
}

//Sets screen to guest view; shows main navigation buttons
function setLoggedOut() {
    resetErrorDiv() //clear any errors
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

function hide(element) {
    element.setAttribute("class", "invisible");
}

function display(element) {
    element.setAttribute("class", "visible");
}

window.addEventListener("load", start);