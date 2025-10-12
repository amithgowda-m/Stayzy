const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const path = require("path");
const methodOverride = require("method-override");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.send("Working, iam root");
});

//create route
app.post("/listings",async(req,res)=>{
  //let {title,description,image,price,country,location} = req.body;
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//index route
app.get("/listings",async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index",{ allListings });
});

// Render new listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//New Route should be above id one
app.post  ("/listings/new",(req,res)=>{
  res.render("listings/new");
});

//show detailed route
app.get("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  const listings = await Listing.findById(id);
  res.render("listings/show",{listings});
});



// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new VIlla",
//         description: "By the beach",
//         price : 60000,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfull testing");
// });

//Update: Edit & update route get and post

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let{id}=req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit",{listing});
});

//Upadte route
app.put("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect("/listings");
});
//delete route
app.delete("/listings/:id", async (req,res)=>{
  let{id}=req.params;
  let deltedListing = await Listing.findByIdAndDelete(id);
  console.log(deltedListing);
  res.redirect("/listings");
});


app.listen(8080, () => {
  console.log("server is listening to 8080 port");
});
