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
    let userText = document.getElementById("user");
    let todoList = document.getElementById('todolist');

    

    hideContent(loginButton,logoutButton, registerButton,userText,addItem,todoList)
    logoutButton.addEventListener("click", logoutUser)
    addItem.addEventListener("keypress",addTodo)
    showUser()
    showTodos()
}

function showTodos() {
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) return;
    fetch('/api/todos/list', {
        method: "GET",
        headers: {
            "authorization": "Bearer " + authToken
        }
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('todolist').innerHTML = data.items;
    })

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


function hideContent(loginButton,logoutButton, registerButton,userText,addItem,todoList) {
    let menuList = document.getElementById('menu')
    let userData = document.getElementById('userdata')
    console.log(userText.parentNode)
    const authToken = localStorage.getItem("auth_token");
    if(!authToken) {
        logoutButton.parentNode.removeChild(logoutButton)
        userText.parentNode.removeChild(userText)
        addItem.parentNode.removeChild(addItem)
        userData.appendChild(userText)
        userData.appendChild(todoList)
        todoList.parentNode.removeChild(todoList)
        userText.parentNode.removeChild(userText)

        menuList.appendChild(loginButton)
        menuList.appendChild(registerButton)
    } else {
        loginButton.parentNode.removeChild(loginButton)
        registerButton.parentNode.removeChild(registerButton)

        menuList.appendChild(userText)
        menuList.appendChild(addItem)
        userData.appendChild(userText)
        userData.appendChild(todoList)
    }

}

function logoutUser(){
    console.log("Logging out!")
    localStorage.removeItem("auth_token");
    window.location.href = "/";
}
