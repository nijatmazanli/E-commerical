
const form = document.querySelector("#login-form");
const names = document.querySelector("#username");
const surnames = document.querySelector("#surname");
const passwd = document.querySelector("#password")
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
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(names.value);
  
  console.log(surnames.value);
  console.log(passwd.value);
  let obj = {
    name: names.value,
    surname:surnames.value,
    password: passwd.value,
  };
  axios.post("http://localhost:6688/users/register", obj).then((res) => {
    console.log(res);

    if (res.status == 200) {
      
      window.location.href = "./login.html";
    } else {
      alert("login melumatlari yalnisdir");
    }
  });
});
