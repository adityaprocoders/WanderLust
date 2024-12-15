const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

// check user login middleware
const {isLoggedIn, isOwner, validateListing} = require("../middleware");

// controller file
const listingController = require("../controller/listing");

// router.route

router.route("/")
// index route
.get(wrapAsync(listingController.index))
  // create route
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.create));  

// new route
router.get("/new",isLoggedIn, listingController.new);

router.route("/:id")
// show route
 .get(wrapAsync(listingController.show))
  // update route
.put(isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
   wrapAsync(listingController.update))
  // delete route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));
  
 
  
  // edit route
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  
  wrapAsync(listingController.edit));
  


module.exports = router;