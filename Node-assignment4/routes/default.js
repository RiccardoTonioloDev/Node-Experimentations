const express = require('express');
const usersData = require('./users');
const router = express.Router();


router.use("/users",(req,res,next)=>{
    res.render("default",{
        pageTitle: "Default",
        isUsers: false,
        isDefault: true,
        users: usersData.users
    });
});

module.exports = router;
