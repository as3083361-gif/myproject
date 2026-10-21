const express=require("express");

const router=express.Router({ mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const Listing=require("../models/listing.js");
const { validateReview, isLoggedIn,isreviewAuthor}=require("../middleware.js");
const controllers=require("../controllers/review.js");


router.post("/",isLoggedIn, validateReview,wrapAsync(controllers.Review));

router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(controllers.ReviewDelete));

module.exports=router;