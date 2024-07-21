const productsContainer = document.querySelector(".products");
const basket = JSON.parse(localStorage.getItem("basket")) || [];
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const loginContainer = document.querySelector(".ch-lg");
const logoutButton = document.querySelector("#logout") || null;

// console.log(logoutButton)
const isLoggedIn = localStorage.getItem("user") !== null; // Use strict comparison
const username = localStorage.getItem("username") || ""; // Set default to empty string

if (!isLoggedIn || username !== "admin") {
  window.location.href = "/index.html";
} else {
  createLoginOrLogout();
  function createLoginOrLogout() {
    const isLogin = localStorage.getItem("user") || false;

    if (isLogin) {
      const logout = document.createElement("button");
      logout.classList.add("ool");
      logout.textContent = "Profile";

      loginContainer.appendChild(logout);
      const log_but = document.querySelector(".ool");
      log_but.addEventListener("click", (e) => {
        e.preventDefault;
        console.log("Dsdds");
        window.location.href = "./profile.html";
      });
    } else {
      const login = document.createElement("button");
      const login_a = document.createElement("a");
      login_a.href = "./login.html";
      login.classList.add("ool");
      login_a.textContent = "Login";

      const register = document.createElement("button");
      const register_a = document.createElement("a");
      register_a.href = "./register.html";
      register.classList.add("ool");
      register_a.textContent = "Register";
      login.appendChild(login_a);
      register.appendChild(register_a);
      loginContainer.appendChild(login);
      loginContainer.appendChild(register);
    }
  }

  async function fetchData() {
    try {
      const response = await fetch(
        "http://localhost:6688/products/all-products"
      ); // Replace with your API endpoint
      const fetchedProducts = await response.json();
      console.log(fetchedProducts);
      createProductCards(fetchedProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors appropriately (e.g., display an error message)
    }
  }


  function sendData(data) {
 
      localStorage.setItem('userData', JSON.stringify(data)); // Store data in local storage
      window.location.href = '/admin/products/edit.html'; // Redirect to receive.html
    }
  
  function createProductCards(products) {
    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Product details (name, image, price, etc.)
      const productName = document.createElement("h3");
      productName.textContent = product.name;
      card.appendChild(productName);

      const productImage = document.createElement("img");
      productImage.src = product.img_link; // Assuming 'image' property in product object
      card.appendChild(productImage);

      const productPrice = document.createElement("p");
      productPrice.textContent = `$${product.price}`; // Assuming 'price' property
      card.appendChild(productPrice);

      // ... add more product details as needed ...

      const addToBasketButton = document.createElement("button");
      addToBasketButton.textContent = "Edit";
      addToBasketButton.classList.add("addBasket");
      addToBasketButton.dataset.productId = product.id; // Add product ID as a data attribute
      addToBasketButton.dataset.productName = product.name;
      addToBasketButton.dataset.productlink = product.img_link;
      addToBasketButton.addEventListener("click", () => { 
      sendData(product)

  })

      const addToFavoritesButton = document.createElement("button");
      addToFavoritesButton.textContent = "Delete";
      addToFavoritesButton.classList.add("addFav");
      addToFavoritesButton.dataset.productId = product.id; // Add product ID as a data attribute
      addToFavoritesButton.dataset.productName = product.name;
      addToFavoritesButton.dataset.productlink = product.img_link;
      // addToFavoritesButton.addEventListener("click", () =>
      // );

      card.appendChild(addToBasketButton);
      card.appendChild(addToFavoritesButton);
      productsContainer.appendChild(card);
    });
  }

  const products = document.querySelector(".products");

  fetchData();
}
