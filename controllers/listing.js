const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});



module.exports.index=async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show=async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path :"author",},}).populate("owner");
    if(!listing){
        req.flash("error"," Listing is not exist:");
       return res.redirect("/listings");
    }
    
    res.render("listings/show.ejs",{listing});
};

module.exports.Create =async (req, res,next) => {
   let response =await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
})
 .send();   
  
    const newListing = new Listing(req.body.listing);
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    console.log("New listing:", newListing);
    newListing.owner = req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    let conste=await newListing.save();
    console.log(conste);
    req.flash("success","New Listing Created:");
    res.redirect("/listings");
};

module.exports.Edit=async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error"," Listing is not exist:");
       return res.redirect("/listings");
    }
    let originalImageUrl =listing.image?.url;
    originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.Update=async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { returnDocument: "after", runValidators: true }
);
    if (!listing) {
        req.flash("error", "Listing does not exist.");
        return res.redirect("/listings");
    }

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

        await listing.save();
    }
    req.flash("success", "Listing updated successfully.");
    return res.redirect(`/listings/${id}`);
};

module.exports.Delete=async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted:");
    res.redirect("/listings");
};

