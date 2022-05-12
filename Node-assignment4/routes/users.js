const express = require('express');
const router = express.Router();
const path = require("path");
const users = [];

router.post("/",(req,res,next)=>{
    users.push({userName: req.body.userName});
    res.redirect("/users");
});

router.use('/',(req,res,next)=>{
    res.render(path.join("users.ejs"),{
        pageTitle: "Users",
        isUsers:true,
        isDefault:false
    });
});

exports.router = router;
exports.users = users;