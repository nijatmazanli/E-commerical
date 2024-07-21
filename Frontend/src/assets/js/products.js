const loginContainer = document.querySelector(".ch-lg");
// console.log(logoutButton)
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
        window.location.href = "./admin/profile.html";
      });
    }
  }
  const productsContainer = document.querySelector(".products");
  const basket = JSON.parse(localStorage.getItem("basket")) || [];
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const logoutButton = document.querySelector("#logout") || null;

  // console.log(logoutButton)

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
    localStorage.setItem("productData", JSON.stringify(data)); // Store data in local storage
    window.location.href = "/admin/products/edit.html"; // Redirect to receive.html
  }

  function createProductCards(products) {
    console.log(products)
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
      const productDesc = document.createElement("p");
      productDesc.textContent = `${product.description}`; // Assuming 'price' property
      card.appendChild(productDesc);

      // ... add more product details as needed ...

      const addToBasketButton = document.createElement("button");
      addToBasketButton.textContent = "Edit";
      addToBasketButton.classList.add("addBasket");
      addToBasketButton.dataset.productId = product.id; // Add product ID as a data attribute
      addToBasketButton.dataset.productName = product.name;
      addToBasketButton.dataset.productlink = product.img_link;
      addToBasketButton.addEventListener("click", () => {
        console.log(product)
        sendData(product);
      });

      const addToFavoritesButton = document.createElement("button");
      addToFavoritesButton.textContent = "Delete";
      addToFavoritesButton.classList.add("addFav");
      addToFavoritesButton.dataset.productId = product.id; // Add product ID as a data attribute
      addToFavoritesButton.dataset.productName = product.name;
      addToFavoritesButton.dataset.productlink = product.img_link;
      addToFavoritesButton.addEventListener("click", () =>{ 
        console.log(product)
        axios.post("http://localhost:6688/admin/products/delete",product).then((response)=>{
          if(response.data.message =="Product deleted successfully"){
                axios.post("http://localhost:6688/products/update/products").then((responsess)=>{
                  if(responsess.data.message == "Updated database"){
                    window.location.href = "/admin/products.html";
                    localStorage.removeItem("productData");
                  }
                })
               
              }
            
        })
      });

      card.appendChild(addToBasketButton);
      card.appendChild(addToFavoritesButton);
      productsContainer.appendChild(card);
    });
  }

  const add = document.querySelector(".add")
  add.addEventListener("click",()=>{
    window.location.href = "./../admin/products/newProduct.html"
  })
  fetchData();
}
