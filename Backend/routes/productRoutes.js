const router = require("express").Router();
const fs = require("fs");
const mysql = require("mysql2/promise");
require('dotenv').config();


const productsDbName = process.env.products_db_name;
const productssDbPassword = process.env.products_db_password
const db_host = process.env.db_host
const prd_db_profile = process.env.username_pr
const connectionProductsConfig = {
  host: db_host, // Replace with your MySQL host (localhost if local)
  user: prd_db_profile, // Replace with your MySQL username
  password: productssDbPassword, // Replace with your MySQL password
  database: productsDbName, // Replace with your database name
};

const connectionProductsPool = mysql.createPool(connectionProductsConfig);

async function checkConnection() {
  connectionProductsPool.getConnection((err, connection) => {
    if (err) {
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.error("Database connection was lost");
      } else {
        console.error("Error connecting to database:", err.stack);
      }
      return;
    }
    console.log("Connected to database as ID " + connection.threadId);

    // You can now perform database operations using the 'connection' object
  });
}


const readData = ()=>{
  return JSON.parse(fs.readFileSync("./data/products.json"));
}


const writeData = (data) => {
  fs.writeFileSync("./data/products.json", JSON.stringify(data, null, 2)); // Add indentation for readability
}

async function getdata() {
  const sql = "SELECT * FROM products"; // Adjust the query as needed

  try {
    const results = await connectionProductsPool.query(sql);

    // Check if results is not empty before accessing elements
    if (results.length > 0) {
      console.log(results[0]);
      writeData(results[0]); // Write the first element only if it exists
    } else {
      console.log("No data found in the database.");
    }
  } catch (err) {
    console.error(err);
  }
}
function insertData(dataToInsert) {
 

  const insertQuery = `INSERT INTO products  (name, description, price, stock, img_link) Values ( "${dataToInsert.name}","${dataToInsert.desc}",${dataToInsert.stock},${dataToInsert.price},"${dataToInsert.img_link}") `
  connectionProductsPool.query(insertQuery, (error, insertResult) => {
    if (error) {
      console.error("Error inserting data:", error);
      return;
    }
    console.log("Data inserted successfully:", insertResult);
  });

  // After perfoming op
}






router.get("/", async(req, res) => {
  // Pass data to the view (optional)
  checkConnection();

  // const dataToInsert = {
  //   name: "Apple",
  //   desc: "nondsdsdse",
  //   price: 100,
  //   stock: 100,
  //   img_link:
  //     "https://th.bing.com/th/id/R.4e02f099b6c2f37184dbaa3fb7763a5a?rik=EYEZnIJgueBLow&riu=http%3a%2f%2fpngimg.com%2fuploads%2fapple_logo%2fapple_logo_PNG19673.png&ehk=Ic2a6mkSJpMNd9U0nN6WU9f5r%2fjYl%2f7Vd6St%2f0%2bq%2b24%3d&risl=&pid=ImgRaw&r=0",
  //   // Add more properties as needed for your table columns
  // };
  
//   insertData(dataToInsert);
// addDataToJson('./data/products.json', JSON.stringify(data));
});
router.get("/all-products", async (req, res) => {
  try {
    
    const data = readData()
    res.status(200).json(data)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Error retrieving products." });
  }
});


module.exports = router;
