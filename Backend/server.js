// require('dotenv').config();


// const port = process.env.PORT;
// const usersDbName = process.env.users_db_name;
// const usersDbPassword = process.env.users_db_password
// const db_host = process.env.db_host
// const usr_db_profile = process.env.username
// const express = require("express");
// const cors = require("cors"); // Assuming you need CORS for frontend requests
// const fs = require("fs")
// const app = express();


// const mysql = require("mysql2/promise");

// const productRoutes = require("./routes/productRoutes");
// const userRoutes = require("./routes/userRoutes");
// const favoriteRoutes = require("./routes/favoriteRoutes");
// const basketRoutes = require("./routes/basketRoutes");
// const adminRoutes = require("./routes/adminRoutes");



// app.use("/products", productRoutes);
// app.use("/users", userRoutes);
// app.use("/favorites", favoriteRoutes);
// app.use("/baskets", basketRoutes);
// app.use("/admin", adminRoutes)

// const connectionUserConfig = {
//   host: db_host, // Replace with your MySQL host (localhost if local)
//   user: usr_db_profile, // Replace with your MySQL username
//   password: usersDbPassword, // Replace with your MySQL password
//   database: usersDbName, // Replace with your database name
// };
// const connectionUserPool = mysql.createPool(connectionUserConfig);


// async function checkConnection() {

//   connectionUserPool.getConnection((err, connection) => {
//     if (err) {
//       if (err.code === "PROTOCOL_CONNECTION_LOST") {
//         console.error("Database connection was lost");
//       } else {
//         console.error("Error connecting to database:", err.stack);
//       }

//       return;
//     }

//     console.log("Connected to database as ID " + connection.threadId);

//     // You can now perform database operations using the 'connection' object
//     return connectionUserPool
//   });
// }



// const readData = ()=>{
//   return JSON.parse(fs.readFileSync("./data/users.json"));
// }


// const writeData = (data)=>{
//   fs.writeFileSync("./data/users.json", JSON.stringify(data));
// }


// async function getdata(){
//   const sql = "SELECT * FROM users"; // Adjust the query as needed

//   try {
//     const results = await connectionUserPool.query(sql);
//     console.log(results);
//     writeData(results[0])
//   } catch (err) {
//     console.error(err);
//   }
// }



// // Serve static files from the "public" folder in the "../Frontend" directory
// app.use(express.static("../Frontend/"));
// app.use(express.json());
// app.use(cors());

// // Route handler for the "/" endpoint
// app.get("/", (req, res) => {
//   // Set the response status code to 200 (OK)
//   res.status(200);

//   // Send a JSON response with a corrected string
//   res.json("This is a valid JSON response"); // Use double quotes for string

//   console.log("Dsdsd"); // Log message after sending the response
// });


// app.listen(port, () => {
//   checkConnection();
  
//   console.log(`Server listening on port ${port}`);
// });


require('dotenv').config();

const port = process.env.PORT;
const usersDbName = process.env.users_db_name;
const usersDbPassword = process.env.users_db_password;
const db_host = process.env.db_host;
const usr_db_profile = process.env.username;

const express = require("express");
const cors = require("cors"); // Assuming you need CORS for frontend requests
const fs = require("fs").promises; // Using promises for cleaner async/await syntax
const mysql = require("mysql2/promise");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const basketRoutes = require("./routes/basketRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Assuming adminRoutes is a valid middleware function

const connectionUserConfig = {
  host: db_host, // Replace with your MySQL host (localhost if local)
  user: usr_db_profile, // Replace with your MySQL username
  password: usersDbPassword, // Replace with your MySQL password
  database: usersDbName, // Replace with your database name
};
const connectionUserPool = mysql.createPool(connectionUserConfig);

async function checkConnection() {
  try {
    const connection = await connectionUserPool.getConnection();
    console.log("Connected to database as ID " + connection.threadId);
    connection.release(); // Release the connection for efficient pool usage
  } catch (err) {
    console.error("Error connecting to database:", err.stack);
  }
}

const readData = async () => {
  try {
    const data = await fs.readFile("./data/users.json");
    return JSON.parse(data); // Use async/await for cleaner reading
  } catch (err) {
    console.error("Error reading data:", err);
    return []; // Return an empty array if reading fails
  }
};

const writeData = async (data) => {
  try {
    await fs.writeFile("./data/users.json", JSON.stringify(data));
  } catch (err) {
    console.error("Error writing data:", err);
  }
};

async function getdata() {
  const sql = "SELECT * FROM users"; // Adjust the query as needed

  try {
    const results = await connectionUserPool.query(sql);
    console.log(results);
    await writeData(results[0]); // Write only the first row if desired
  } catch (err) {
    console.error(err);
  }
}

const app = express();

app.use(express.static("../Frontend/")); // Serve static files
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS if needed

// Mount routes with proper middleware (assuming adminRoutes is a middleware function):
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/baskets", basketRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).json("This is a valid JSON response");
  console.log("Dsdsd");
});
const ip = '0.0.0.0'; // Replace with your machine's local IP address

app.listen(port,ip, async () => {
  await checkConnection(); // Use async/await for clarity
  console.log(`Server listening on port ${port}`);
});
