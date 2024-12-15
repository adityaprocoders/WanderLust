const { authenticate, session} = require("passport");
const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchma} = require("./schema");
const expressError = require("./utils/expressError");
const {reviewSchema} = require("./schema");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
         // redirecturl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "your must be Logged in to");
        return res.redirect("/login");
    };
    next();
};
 
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// for owner

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// is Author

module.exports.isAuthor = async(req,res,next) => {
  let {id, reviewId} = req.params; 
  const review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "you are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
  }
  next();
};

// validate listing

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchma.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new expressError(400, errMsg);
    }else{
      next()
    };
  };



// validate review

module.exports.validateReview  = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new expressError(400, errMsg);
    }else{
      next()
    };
  };
