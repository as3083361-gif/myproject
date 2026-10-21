const Listing = require("./models/listing.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} =require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you are not login");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl =req.session.redirectUrl ;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "Listing does not exist.");
        return res.redirect("/listings");
    }

    if (!listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.validateListing = (req,res,next)=>{
    if (!req.body||!req.body.listing) {
        return new ExpressError(400, "Invalid listing data");
    }
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        return new ExpressError(400,errMsg);
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


module.exports.isreviewAuthor = async(req,res,next)=>{
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
     if (!review) {
        req.flash("error", "Review does not exist.");
         return res.redirect(`/listings/${id}`);
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not author of Review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}