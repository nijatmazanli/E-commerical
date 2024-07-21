
const productsContainer = document.querySelector(".products");
const basket = JSON.parse(localStorage.getItem("basket")) || "[]";
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const loginContainer = document.querySelector(".ch-lg")
const logoutButton = document.querySelector("#logout") || null;

// console.log(logoutButton)
createLoginOrLogout()


function createLoginOrLogout(){
  const isLogin = localStorage.getItem("user") || false;

  if (isLogin) {
    const logout = document.createElement("button")
    logout.classList.add("ool")
    logout.textContent = "Profile"

    loginContainer.appendChild(logout)
    const log_but = document.querySelector(".ool")
    log_but.addEventListener("click",(e)=>{
      e.preventDefault
      console.log("Dsdds")
      window.location.href = "./users/profile.html"
    })
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
async function fetchData() {
  try {
    const response = await fetch("http://localhost:6688/products/all-products"); // Replace with your API endpoint
    const fetchedProducts = await response.json();
    console.log(fetchedProducts)
    createProductCards(fetchedProducts);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., display an error message)
  }
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
    addToBasketButton.textContent = "Add to Basket";
    addToBasketButton.classList.add("addBasket");
    addToBasketButton.dataset.productId = product.id; // Add product ID as a data attribute
    addToBasketButton.dataset.productName = product.name;
    addToBasketButton.dataset.productlink = product.img_link;
    addToBasketButton.addEventListener("click", () => handleAddToBasket(product.id,product.name,product.img_link));

    const addToFavoritesButton = document.createElement("button");
    addToFavoritesButton.textContent = "Add to Favorites";
    addToFavoritesButton.classList.add("addFav");
    addToFavoritesButton.dataset.productId = product.id; // Add product ID as a data attribute
    addToFavoritesButton.dataset.productName = product.name;
    addToFavoritesButton.dataset.productlink = product.img_link;
    addToFavoritesButton.addEventListener("click", () => handleAddToFavorites(product.id,product.name,product.img_link));

    card.appendChild(addToBasketButton);
    card.appendChild(addToFavoritesButton)
    productsContainer.appendChild(card);
  });
}

const products = document.querySelector(".products");

function handleAddToBasket(productId,productName,productImg) {
  const isLogin = localStorage.getItem("user") || false;

  if (!isLogin) {

    window.location.href = "login.html";
  } else {
    if (basket.find((elem) => elem.id === productId)) {
      const existingItem = basket.find((elem) => elem.id === productId);
      existingItem.count++;
    } else {
      let newItem = {
        id: productId,
        name: productName,
        img_link:productImg,
        count: 1,
      };
      basket.push(newItem);
    }

    localStorage.setItem("basket", JSON.stringify(basket));
  }
}

function handleAddToFavorites(productId,productName,productImg) {
  const isLogin = localStorage.getItem("user") || false;

  if (!isLogin) {

    window.location.href = "login.html";
  } else {
    if (favorites.find((elem) => elem.id === productId)) {
      const existingItem = favorites.find((elem) => elem.id === productId);
      existingItem.count++;
    } else {
      let newItem = {
        id: productId,
        name: productName,
        img_link:productImg,
        count: 1,
      };
      favorites.push(newItem);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}
  
fetchData();
