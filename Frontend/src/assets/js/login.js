const form = document.querySelector("#login-form");
const loginContainer = document.querySelector(".ch-lg")
createLoginOrLogout()


function createLoginOrLogout(){
  const isLogin = localStorage.getItem("user") || false;

  if (isLogin) {
    const logout = document.createElement("button")
    logout.classList.add("ool")
    logout.textContent = "Logout"

    loginContainer.appendChild(logout)
  }
  else{
    const login = document.createElement("button")
    const login_a = document.createElement("a")
    login_a.href = "./login.html"
    login.classList.add("ool")
    login_a.textContent = "Login"
    
    const register  = document.createElement("button")
    const register_a = document.createElement("a")
    register_a.href = "./register.html"
    register.classList.add("ool")
    register_a.textContent = "Register"
    login.appendChild(login_a)
    register.appendChild(register_a)
    loginContainer.appendChild(login)
    loginContainer.appendChild(register)

  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userData = {
    name: formData.get("username"),
    password: formData.get("password"),
  };
  axios
    .post("http://localhost:6688/users/login", userData)
    .then((response) => {
      if (response.data.message === "Login successful.") {
        localStorage.setItem("user", response.data.token); // Store token in localStorage
        localStorage.setItem("userID", response.data.userId); // Store userId in localStorage
        localStorage.setItem("username", response.data.username); // Store username in localStorage
        // Redirect to protected area or display success message
        console.log("Login successful!");
        window.location.reload
        window.location.href="/index.html"
      } else {
        alert("Invalid username or password.");
      }
      if (response.data.message == "Invalid username or password.") {
        console.log("Dsdsdsdsdsdsd");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error during login.Check Credentians");
    });

  console.log(userData);
});
