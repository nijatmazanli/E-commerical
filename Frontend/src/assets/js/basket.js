const loginContainer = document.querySelector(".ch-lg");
createLoginOrLogout();

const basketContainer = document.querySelector(".basketContainer");

function createLoginOrLogout() {
  const isLogin = localStorage.getItem("user") || false;

  if (isLogin) {
    const logout = document.createElement("button");
    logout.classList.add("ool");
    logout.textContent = "Logout";

    loginContainer.appendChild(logout);
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
async function getData() {
  console.log("dsdsdsdssd");
  try {
    const response = await fetch("http://localhost:6688/products/all-products"); // Replace with your API endpoint
    const fetchedProducts = await response.json();
    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., display an error message)
  }
}

async function displayBasketItems() {
  const isLogin = localStorage.getItem("user") || false;

  if (!isLogin) {
    window.location.href = "login.html";
  } else {
    try {
      const products = await getData();

      const basketArr = JSON.parse(localStorage.getItem("basket")) || [];
      const resultBasketArr = [];

      basketArr.forEach((item) => {
        const foundProduct = products.find((elem) => elem.id === item.id);
        if (foundProduct) {
          try {
            resultBasketArr.push({
              ...foundProduct, // Spread product details
              count: item.count, // Add quantity from basket
            });
          } catch (error) {
            console.error("Error processing item:", error, item);
            // Handle specific item processing errors (optional)
          }
        }
      });

      createBasketItems(resultBasketArr);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors appropriately (e.g., display an error message)
    }
  }

  function createBasketItems(basketItems) {
    basketItems.forEach((item) => {
      const basketItem = document.createElement("div");
      basketItem.classList.add("basketItem");

      const itemName = document.createElement("h3");
      const itemImg = document.createElement("img");

      try {
        itemName.textContent = `${item.name} - $${item.price}`; // Abbreviate title and display price
        itemImg.src = item.img_link;
      } catch (error) {
        console.error("Error rendering item:", error, item);
        // Handle specific rendering errors (optional)
      }
      basketItem.appendChild(itemName);
      basketItem.appendChild(itemImg);

      // Add buttons and quantity display (implement functionality)
      const quantityIncreaseButton = document.createElement("button");
      quantityIncreaseButton.textContent = "+";
      // ... attach click event listener to handle quantity increase ...

      const quantitySpan = document.createElement("span");
      quantitySpan.textContent = item.count;

      const quantityDecreaseButton = document.createElement("button");
      quantityDecreaseButton.textContent = "-";
      // ... attach click event listener to handle quantity decrease ...

      basketItem.appendChild(quantityIncreaseButton);
      basketItem.appendChild(quantitySpan);
      basketItem.appendChild(quantityDecreaseButton);

      basketContainer.appendChild(basketItem);
    });
  }
}

displayBasketItems();
