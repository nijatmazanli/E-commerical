const loginContainer = document.querySelector(".ch-lg");
const logoutButton = document.querySelector("#logout") || null;

// console.log(logoutButton)
const isLoggedIn = localStorage.getItem("user") !== null; // Use strict comparison
const username = localStorage.getItem("username") || "";   // Set default to empty string


if (!isLoggedIn || username !== "admin") {
  window.location.href = "/index.html";
}
  
 else {
    createLoginOrLogout();

  async function logoutt() {
    console.log("Dsddsdsdsd");
    const userData = {
      username: localStorage.getItem("username"),
      userId: localStorage.getItem("userID"),
      token: localStorage.getItem("user"),
      favorites:localStorage.getItem("favorites"),
      basket:localStorage.getItem("basket")
    };
    axios
      .post(`http://localhost:6688/admin/logout/log`, userData)
      .then((response) => {
        if (response.data.message == "Logged Succesfully") {
          localStorage.removeItem("user");
          localStorage.removeItem("userID");
          localStorage.removeItem("username");
          localStorage.removeItem("favorites");
          localStorage.removeItem("basket");
          
          console.log("dadadaaddad");
          window.location.reload();
          window.location.href = "/index.html"
        } else {
          console.log("Error ocurred in server side");
        }
      });
  }

  function createLoginOrLogout() {
    const isLogin = localStorage.getItem("user") || false;
    const username = localStorage.getItem("username") || false;

    if (isLogin && username == "admin") {
      const logout = document.createElement("button");
      logout.classList.add("ool");
      logout.textContent = "Logout";

      loginContainer.appendChild(logout);
      const log_but = document.querySelector(".ool");
      log_but.addEventListener("click", (e) => {
        e.preventDefault;
        console.log("Dsdds");
        logoutt();
      });
    } else {
      window.location.href = "/index.html";
      const login = document.createElement("button");
      const login_a = document.createElement("a");
      login_a.href = "./../login.html";
      login.classList.add("ool");
      login_a.textContent = "Login";

      const register = document.createElement("button");
      const register_a = document.createElement("a");
      register_a.href = "./../register.html";
      register.classList.add("ool");
      register_a.textContent = "Register";
      login.appendChild(login_a);
      register.appendChild(register_a);
      loginContainer.appendChild(login);
      loginContainer.appendChild(register);
    }
  }
}
