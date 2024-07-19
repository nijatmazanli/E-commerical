const router = require("express").Router(); // Use Router() for modular routing
const bodyParser = require("body-parser"); // Middleware for body parsing
const fs = require("fs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt"); // Password hashing library
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Assuming you need CORS for frontend requests
const { body, validationResult } = require('express-validator');

require("dotenv").config(); // Load environment variables at the beginning of your application

const usersDbName = process.env.users_db_name;
const usersDbPassword = process.env.users_db_password;
const db_host = process.env.db_host;
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

router.post("/login/", [
  // Validate username
  body('usernames')
    .exists()
    .withMessage('Username is required')
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),

  // Validate password
  body('password')
    .exists()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => 
 {
  console.log(process.env.JWT_SECRET);
  const data = req.body; // Access data from req.body after body-parser parsing
  const username = data.name; // Assuming username for login

  const { name, password } = req.body;
  console.log(name,password);
  // Validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  
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
        message: `${userId} :: ${username} logged in time ${date.getTime}`,
      };

      writeLog("./data/app.log", logData);

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

router.post("/register", async (req, res) => {
  const data = req.body; // Access data from req.body after body-parser parsing
  console.log(data);
  checkConnection();

  try {
    // Hash the password
    const hash = await bcrypt.hash(data.password, 10); // Adjust salt rounds as needed

    const insertQuery = `INSERT INTO users (name, surname, password) VALUES ("${data.name}","${data.surname}","${hash}")`;
    const results = await connectionUserPool.query(insertQuery);
    const logData = {
      message: `${data.name} :: ${data.surname} registered time ${date.getTime} `,
    };

    writeLog("./data/app.log", logData);
    res.json(results); // Send response after successful insertion
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user." });
  }
  // getdata()
});

router.post("/get-data", async (req, res) => {
  const results = getdata();
});

router.post("/logout/log", async (req, res) => {
  const data = req.body; // Access user data if needed
  const logData = {
    message: `${data.userId} :: ${data.username} logged out time ${data.token}`,
  };

  writeLog("./data/app.log", logData);
  res.status(200).json({ message: "Logged Succesfully" });
});

// router.post("/logout",(req,res)=>{
//   logout()
// })
module.exports = router;
