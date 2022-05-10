const express = require("express");
const path = require("path");
const rootPath = require("../utils/path");

const router = express.Router();

router.use("/users",(req,res,next)=>{
    res.sendFile(path.join(rootPath,"views","users.html"));
});

module.exports = router;