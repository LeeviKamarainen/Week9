
if (document.readyState !== "loading") {
    initializeCodeLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      initializeCodeLogin();
    });
  }

  
  function initializeCodeLogin() {
    document.getElementById("register-form").addEventListener("submit", registerUser);
}


function registerUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(formData)
    console.log(event.target)
    fetch("/api/user/register", {
      method: "POST",
      body: formData
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  if(data.message) {
    document.getElementById('errormessage').innerHTML = 'Email already in use';
    }
    else if(data.errors) {
     document.getElementById('errormessage').innerHTML = 'Password is not strong enough'; 
    }
    else {
    window.location.href="/login.html";
    }
    })
  
  
  }