

const mongoose = require("mongoose");
const listing = require("../models/listing");
const initData = require("./data.js");


// mongo connection
const mongo_URL = "mongodb://127.0.0.1:27017/wanderlest";

main().then(() =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongo_URL);
};

const initDb = async() => {
    await listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "675bb676d45607a30464aa60"}));
   await listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDb();