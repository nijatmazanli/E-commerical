const express = require("express");
const cors = require("cors"); // Assuming you need CORS for frontend requests

const app = express();
const port = 6688;

// Serve static files from the "public" folder in the "../Frontend" directory
app.use(express.static("Frontend/src/public"));

// Route handler for the "/dsdsds" endpoint
app.get("/", (req, res) => {
  // Set the response status code to 200 (OK)
  res.status(200);

  // Send a JSON response with a corrected string
  res.json("This is a valid JSON response"); // Use double quotes for string

  console.log("Dsdsd"); // Log message after sending the response
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
