const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController =require("../controllers/listing.js");
const { upload } = require("../cloudConfig.js");


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.Create));

// New route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.Update))

    .delete(isLoggedIn, isOwner,wrapAsync(listingController.Delete));
// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.Edit));


module.exports=router;