let loginFormDiv;
let registerFormDiv;
let errorDiv;
let welcomeDiv;
let loginForm;
let registerForm;

const API = "http://localhost:5000"

function start() {
    loginFormDiv = document.getElementById("loginFormDiv");
    registerFormDiv = document.getElementById("registerFormDiv");
    errorDiv = document.getElementById("errorDiv");
    welcomeDiv = document.getElementById("welcomeDiv")

    const registerLink = document.getElementById("registerLink");
    registerLink.addEventListener("click", displayRegisterForm);

    const loginLink = document.getElementById("loginLink");
    loginLink.addEventListener("click", displayLoginForm);

    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");

    loginForm.addEventListener("submit", loginFormSubmit);
    registerForm.addEventListener("submit", registerFormSubmit);

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", logoutClicked)
}

function displayLoginForm() {
    loginForm.reset();  //clear form
    registerFormDiv.setAttribute("class", "invisible");
    loginFormDiv.setAttribute("class", "visible");
}

function displayRegisterForm() {
    registerForm.reset();   //clear form
    loginFormDiv.setAttribute("class", "invisible");
    registerFormDiv.setAttribute("class", "visible");
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

        if (response.ok) {
            let jsonObj = await response.json();
            setLoggedOut();
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

//Sets screen to user view with logout button
function setLoggedIn(username) {
    resetErrorDiv() //clear any errors
    loginFormDiv.setAttribute("class", "invisible");
    welcomeDiv.setAttribute("class", "visible");
    document.getElementById("username").innerHTML = username;
}

//Sets screen to guest view; shows main navigation buttons
function setLoggedOut() {
    resetErrorDiv() //clear any errors
    welcomeDiv.setAttribute("class", "invisible");
    displayLoginForm();
    document.getElementById("username").innerHTML = "";
}

//Sets the error div to any error messages received
function setErrorDiv(error) {
    errorDiv.setAttribute("class", "alert alert-danger");
    errorDiv.innerHTML = error;
}

//Hides error div and resets innerHTML content
function resetErrorDiv() {
    errorDiv.setAttribute("class", "invisible")
    errorDiv.innerHTML = "";
}

window.addEventListener("load", start);