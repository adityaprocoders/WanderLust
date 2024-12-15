const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware") 
 
// controller
const userController = require("../controller/user")

// signup
// router.route
router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup));

 

// login
router.route("/login")
.get(userController.loginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect : "/login",
     failureFlash : true
    })
    , userController.login);

// logout

router.get("/logout",userController.logout);

module.exports = router;