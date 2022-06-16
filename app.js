//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/toDoListDB');

const itemSchema  = {
  name : String
};
const Item = mongoose.model("Item",itemSchema);

const Item1 = new Item({
name : "Welcome to the toDOList"
});
const Item2 = new Item({
  name : "Press +  Button to add item"
  });
const Item3 = new Item({
    name : "<-- press to delete item"
    });
const defaultItem = [Item1,Item2, Item3];
// Item.insertMany(defaultItem,function (err) {
//   if (err){
//     console.log(err);
//   }else{
//     console.log("Successful to log with DB");
//   }
// });

app.get("/", function(req, res) {

Item.find({},function (err, founditems) {
  if (founditems.length === 0){
     Item.insertMany(defaultItem,function (err) {
  if (err){
    console.log(err);
  }else {
    console.log("Successful to log with DB");
  }
 });
 res.redirect("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: founditems});


  }

});

 

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/")
 
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
