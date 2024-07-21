const productForm = document.getElementById("productForm");
const isLoggedIn = localStorage.getItem("user") !== null; // Use strict comparison
const username = localStorage.getItem("username") || ""; // Set default to empty string

if (!isLoggedIn || username !== "admin") {
  window.location.href = "/index.html";
} else {
  async function fetchData() {
    try {
      const data = localStorage.getItem("productData");

      console.log(JSON.parse(data));
      placeData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors appropriately (e.g., display an error message)
    }
  }

  function placeData(data) {
   
    data = JSON.parse(data);
    // Access form data
    document.getElementById("name").value = data.name;
    document.getElementById("desc").value = data.description;
    document.getElementById("price").value = data.price;
    document.getElementById("stock").value = data.stock;
    document.getElementById("img_link").value = data.img_link;
    console.log(document.getElementById("name").value, data);

    const productForm = document.getElementById("productForm");

    productForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      const newData = {
        id:data.id,
        name:document.getElementById("name").value,
        description: document.getElementById("desc").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        img_link: document.getElementById("img_link").value,
      };
      // You can now process the product data here:
      // - Send data to a server using an AJAX request (e.g., fetch or Axios)
      // - Store data locally (if applicable)
      // - Display a confirmation message
      console.log("Product data:", newData);
      const userData = {
        username: localStorage.getItem("username"),
        user: localStorage.getItem("user"),
        userID: localStorage.getItem("userID"),
      };
      axios
        .post("http://localhost:6688/admin/check", userData)
        .then((responses) => {
          if (responses.data.message == "Approved") {
            axios
              .post("http://localhost:6688/admin/products/edit", newData)
              .then((response) => {
                if (response.data.message == "Changed") {
                  axios.post("http://localhost:6688/products/update/products").then((responsess)=>{
                    if(responsess.data.message == "Updated database"){
                      window.location.href = "/admin/products.html";
                      localStorage.removeItem("productData");
                    }
                  })
                 
                }
              });

          }
          else if (responses.data.message == "User Not Allowed"){
            window.location.href = "/notfound.html"

          }
        });
      // Clear the form after successful submission (optional)
    });

    // You can now process the product data here:
    // - Send data to a server using an AJAX request (e.g., fetch or Axios)
    // - Store data locally (if applicable)
    // - Display a confirmation message
  }
  fetchData();
}
