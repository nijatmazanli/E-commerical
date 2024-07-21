const router = require("express").Router(); // Use Router() for modular routing
const bodyParser = require("body-parser"); // Middleware for body parsing
const fs = require("fs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt"); // Password hashing library
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Assuming you need CORS for frontend requests
const { body, validationResult } = require("express-validator");
const { decrypt } = require("dotenv");

require("dotenv").config(); // Load environment variables at the beginning of your application

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const seconds = now.getSeconds().toString().padStart(2, '0');
const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

const detailedTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours}:${minutes}:${seconds}.${milliseconds}`;



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


const usersDbName = process.env.users_db_name;
const usersDbPassword = process.env.users_db_password;
const usr_db_profile = process.env.username;
const date = new Date();
const generateToken = (userId, username, namehash) => {
  const payload = {
    userId,
    username,
    namehash,
  };
  const secret = process.env.JWT_SECRET;
  const options = {};
  return jwt.sign(payload, secret, options);
};

const connectionUserConfig = {
  host: db_host, // Replace with your MySQL host (localhost if local)
  user: usr_db_profile, // Replace with your MySQL username
  password: usersDbPassword, // Replace with your MySQL password
  database: usersDbName, // Replace with your database name
};
const connectionUserPool = mysql.createPool(connectionUserConfig);
const connectionProductsPool = mysql.createPool(connectionProductsConfig);

const readData = () => {
  return JSON.parse(fs.readFileSync("./data/users.json"));
};
const readLogData = async () => {
  return JSON.parse(fs.readFileSync("./data/userActions.json"));
};

const writeData = async (data) => {
  fs.writeFileSync("./data/users.json", JSON.stringify(data));
};

const logWrite = async (data) => {
  fs.writeFileSync("./data/userActions.json", JSON.stringify(data));
};

async function getdata() {
  const sql = "SELECT * FROM users"; // Adjust the query as needed

  try {
    const results = await connectionUserPool.query(sql);
    console.log(results);
    writeData(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data." });
  }
}

function checkConnection() {
  connectionUserPool.getConnection((err, connection) => {
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

function writeLog(filePath, data) {
  try {
    if (!fs.existsSync(filePath)) {
      // Create the file if it doesn't exist
      fs.writeFileSync(filePath, "", { flag: "wx" }); // Use 'wx' flag for exclusive creation
      console.log(`Log file created: ${filePath}`);
    }

    const formattedData = JSON.stringify(data, null, 2); // Format with indentation
    fs.appendFileSync(filePath, formattedData + "\n"); // Append data with newline
  } catch (error) {
    console.error("Error writing log data:", error);
    // Handle other potential errors (e.g., permission issues)
  }
}

// Example usage

// Add body-parser middleware to parse JSON data from requests
router.use(bodyParser.json()); // Assuming you're using the main app instance (app)

router.post("/login/", async (req, res) => {
  console.log(process.env.JWT_SECRET);
  const data = req.body; // Access data from req.body after body-parser parsing
  const username = data.name; // Assuming username for login

  // const { name, password } = req.body;
  // console.log(name,password);
  // // Validate input using express-validator
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.mapped() });
  // }

  try {
    const sql = `SELECT id,password FROM users WHERE name = ?`;
    const [rows] = await connectionUserPool.query(sql, [username]); // Use prepared statements
    console.log(rows);
    if (!rows.length) {
      // Handle invalid username
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const hashedPassword = rows[0].password; // Stored hashed password
    const oldData = await readLogData();
    const newwdata = [];
    const isMatch = await bcrypt.compare(data.password, hashedPassword);
    // console.log(hash,hashedPassword,isMatch);
    if (isMatch) {
      const date = new Date();
      const userId = rows[0].id * (date.getMilliseconds() / 10000); // Get user ID from retrieved data
      const namehash = await bcrypt.hash(username, 10);
      console.log(userId, date.getTime(), namehash);
      console.log(oldData);
      const token = generateToken(userId, username, namehash); // Generate JWT token
      const logData = {
        message: `${userId} :: ${username} logged in time ${detailedTime} Token :: ${token}`,
      };

      writeLog("./data/admin.log", logData);

      res.json({ message: "Login successful.", token, userId, username });
    } else {
      return res.status(200).json({ message: "Invalid username or password." });
    }

    console.log(process.env.JWT_SECRET, isMatch, hashedPassword, sql, data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login." });
    console.log("DSdd");
  }
});
router.post("/logout/log", async (req, res) => {
  const data = req.body; // Access user data if needed
  const logData = {
    message: `${data.userId} :: ${data.username} logged out time ${detailedTime} token:${data.token}`,
  };
  const connection = await connectionUserPool.getConnection(); // Get a connection from the pool
  console.log(data)
  const query = `UPDATE users SET favorites = ?, basket = ? WHERE name = ?`
  const [updateResult] = await connection.query(query, [
    data.favorites,
    data.basket,
    data.username
  ]);

  console.log("Product updated successfully:", updateResult);

 connection.release(); // Release t
  writeLog("./data/admin.log", logData);
  res.status(200).json({ message: "Logged Succesfully" });
});

router.post("/products/edit",async (req,res)=>{
  const data = req.body
  console.log(data)
  const id = data.id
  const name = data.name || "not given"
  const description = data.description || "not given"
  const price = parseInt(data.price) || 0
  const stock = parseInt(data.stock) || 0
  const img_link = data.img_link
  try {
    const connection = await connectionProductsPool.getConnection(); // Get a connection from the pool

    // Sanitize user input to prevent SQL injection (highly recommended)
  

    const query = `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, img_link = ? WHERE id = ?`;
    const [updateResult] = await connection.query(query, [
      name,
      description,
      price,
      stock,
      img_link,
      id
    ]);

    console.log("Product updated successfully:", updateResult);

   connection.release(); // Release the connection back to the pool

    res.status(200).json({ message: "Changed" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
})

router.post("/check",async (req,res)=>{
  const clientIp = req.ip; // Access the client's IP address

  console.log(req.body, clientIp)

  const data = req.body
  const usrHash = data.username
  const usrID = data.userID
  const token = data.user

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
  console.log('Decoded JWT payload:', decoded);

  if (decoded.userId == usrID && decoded.username == usrHash){
    console.log("Checking hash...")
    const isMatch = await bcrypt.compare(usrHash, decoded.namehash);
    if (isMatch){
    res.status(200).json({message:"Approved"})
    }
    else{
      res.status(200).json({message:"User Not Allowed"})
    }
  }
  else{
    const logData = {
      message: `${usrID} :: ${usrHash} tried to change or login ${detailedTime} IP ${clientIp} token:${token}`,
    };
    writeLog("../data/admin-danger.log",logData)
    console.log("disallowed")
    res.status(200).json({message:"User Not Allowed"})
  }
})



router.post("/products/new",async (req,res)=>{
  const data = req.body
  console.log(data)
  const id = data.id
  const name = data.name || "not given"
  const description = data.description || "not given"
  const price = parseInt(data.price) || 0
  const stock = parseInt(data.stock) || 0
  const img_link = data.img_link
  try {
    const connection = await connectionProductsPool.getConnection(); // Get a connection from the pool

    try {
      // Sanitize user input to prevent SQL injection (highly recommended)
      const sanitizedName = connection.escape(name); // Escape user input for safe execution
      const sanitizedDescription = connection.escape(description);
      const sanitizedPrice = parseFloat(price); // Ensure price is a number
      const sanitizedStock = parseInt(stock); // Ensure stock is an integer
      const sanitizedImgLink = connection.escape(img_link);
    
      // Construct the UPDATE query with prepared statements
      const updateQuery = `
      INSERT INTO products (name, description, price, stock, img_link)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    
      // Execute the query with sanitized data
      const [updateResult] = await connection.query(updateQuery, [
        sanitizedName,
        sanitizedDescription,
        sanitizedPrice,
        sanitizedStock,
        sanitizedImgLink,
      ]);
    
      console.log("Product updated successfully:", updateResult);
    } catch (error) {
      console.error("Error updating product:", error);
      // Handle errors appropriately (e.g., rollback transaction, return error response)
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
    



    res.status(200).json({ message: "Changed" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
})



router.post("/products/delete",async(req,res)=>{
  const productId = req.body.id; // Assuming the product ID is in the request body

  if (!productId) {
    return res.status(400).json({ message: "Missing product ID" });
  }

  const deleteQuery = `DELETE FROM products WHERE id = ?`;

  try {
    const [deleteResult] = await connectionProductsPool.query(deleteQuery, [productId]);
    console.log("Product deleted:", deleteResult);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
})
router.post("/users/delete",async(req,res)=>{
  const productId = req.body.name; // Assuming the product ID is in the request body

  if (!productId) {
    return res.status(400).json({ message: "Missing product ID" });
  }

  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  try {
    const [deleteResult] = await connectionProductsPool.query(deleteQuery, [productId]);
    console.log("Product deleted:", deleteResult);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
})



module.exports =router