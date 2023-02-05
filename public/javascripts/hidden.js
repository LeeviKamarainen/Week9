if (document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCode();
    });
  }
  
  function initializeCode() {
    let logoutButton = document.getElementById("logout");
    let loginButton = document.getElementById("login");
    let registerButton = document.getElementById("register");
    let addItem = document.getElementById("add-item");
    const userText = document.getElementById("user");
    hideContent(loginButton,logoutButton, registerButton,userText,addItem)
    logoutButton.addEventListener("click", logoutUser)
    addItem.addEventListener("keypress",addTodo)
    showUser()
}


async function addTodo(event) {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) return;
    if(event.key === "Enter"){
    event.preventDefault();
    console.log(event.target.value)
    await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({items: [event.target.value]}),
        headers: {
            "authorization": "Bearer " + authToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.text())
    .then((data) => {
        console.log(data)
    })
}

}


function showUser() {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) return;
    fetch("/api/private", {
        method: "GET",
        headers: {
            "authorization": "Bearer " + authToken
        }
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("user").innerHTML = data.email;
        })
        .catch((e) => {
            console.log("error" + e);
        })


}


function hideContent(loginButton,logoutButton, registerButton,userText,addItem) {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) {
        logoutButton.hidden = true;
        userText.hidden = true;
        addItem.hidden = true;
    } else {
        loginButton.hidden = true;
        registerButton.hidden = true;
        userText.hidden = false;
        addItem.hidden = false;
    }

}

function logoutUser(){
    console.log("Logging out!")
    localStorage.removeItem("auth_token");
    window.location.href = "/";
}
