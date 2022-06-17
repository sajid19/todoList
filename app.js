//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const _ = require('lodash');

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
const listSchema = {
  name : String,
  items : [itemSchema]
}
const List = mongoose.model("List",listSchema)


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

app.get("/:customListName", function(req, res) {
 const customListName = _.capitalize( req.params.customListName);
 List.findOne({name:customListName},function (err ,foundlist) {
  if(!err){
    if(!foundlist){
      const list = new List({
        name : customListName,
        items :defaultItem
       });
       list.save()
       res.redirect("/" + customListName);

    }else{
      res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items})

    }
  }
 })


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list
  const item = new Item({
    name: itemName
  });
  if (listName === "Today"){
    item.save();
    res.redirect("/");

  }else{
    List.findOne({name :listName},function (err,foundlist) {
      foundlist.items.push(item)
      foundlist.save();
      res.redirect("/" + listName);
    });
  } 
});

app.post("/delete",function (req, res) {
const checkedItemId = req.body.checkbox ;
const listName = req.body.listName;
if (listName === "Today"){
  Item.findByIdAndRemove(checkedItemId,function (err) {
    if (!err){
      console.log("deleted");
      res.redirect("/")
    }
  });
}else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function (err, foundList) {
    if(!err){
      res.redirect("/" + listName);
    }
  });
}


});




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
