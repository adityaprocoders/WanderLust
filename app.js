if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
};

 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const MongoStore = require('connect-mongo');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");



// routes files
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const usersRouter = require("./routes/user");


// mongo connection
const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}



// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "/public")));

// mongo session
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

 

// express session
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 *60 *60 * 1000,
    maxAge: 7 * 24 *60 *60 * 1000,
    httpOnly: true,
  },
};

// express session & flash
app.use(session(sessionOption));
app.use(flash());


// passport middlewaree
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// flash mid
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

 


  
// routing

app.use("/listings",  listingsRouter);

// review routing
app.use("/listings/:id/reviews", reviewsRouter);

// signup & login
app.use("/", usersRouter);


  




 

 
// does't exit route

app.all("*",(req,res,next)=>{
  next(new expressError(404,"page NOT Found"));
})




// custom err handler
app.use((err,req,res,next)=>{
  let {statusCode = 500,message = "something went worng"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});


// server star

app.listen(8080,()=>{
    console.log("app is listen on 8080");
})
