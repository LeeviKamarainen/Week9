
if (document.readyState !== "loading") {
    initializeCodeLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
  }

  function initializeCodeLogin() {
    document.getElementById("login-form").addEventListener("submit", loginUser);
}

function loginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch("/api/user/login", {
        method: "POST",
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
    if(data.token) {
        storeToken(data.token);
        let user = document.getElementById("user")
        window.location.href="/";
        user.value = data.email;
    }
    else{
        if(data.message) {
            document.getElementById('error').innerHTML = data.message;
        } else {
            document.getElementById('error').innerHTML = "Very strange error!";
        }
      }
    })
}



function storeToken(token) {
  localStorage.setItem('auth_token', token);
}