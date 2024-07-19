const router = require("express").Router();
const fs = require("fs");
 

router.get('/', (req, res) => {
    // Pass data to the view (optional)
    const data = { message: 'Hello from Express!' };
});


module.exports = router;


