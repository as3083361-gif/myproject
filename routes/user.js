const express=require("express");
const router=express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl} =require("../middleware.js");
const controllers=require("../controllers/user.js");
const { loggout } = require("../controllers/user.js");

router.route("/signup")
    .get(controllers.getrouter)
    .post(wrapAsync(controllers.postrouter));

 router.route("/login")
    .get(controllers.loginget)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    wrapAsync(controllers.loginpost)
);

router.get("/logout",controllers.loggout);

module.exports =router;