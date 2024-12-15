const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
 

 
const {validateReview , isLoggedIn, isAuthor} = require("../middleware");

// mvc controller
const reviewController = require("../controller/review");



// Reviews 
// post route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));
  
  
  // delete route
  
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.deleteReview));
  

module.exports = router;