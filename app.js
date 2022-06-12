const express = require("express")
const bodyParser = require("body-parser")

const app = express();
var items = ["Buy Food", "Eat Food","Cook Food"]
var workItems = []
app.set('view engine', 'ejs');
 app.use(express.static( "public"));

app.use(bodyParser.urlencoded({extended:true}));



app.get("/", function (req, res) {
 let today =  new Date()
 let option = {
     weekday : "long",
     day : "numeric",
     month: "long"
 }
 let day = today.toLocaleDateString("en-Us" ,option)
 

 

res.render("list",{listTitle : day,newlistItems :items
});



}    
)
app.post("/",function (req, res) {
    let item = req.body.newitem ;

    if (req.body.list === "Work"){
        workItems.push(item) 
        res.redirect("/work")

    }else{
        items.push(item)
    res.redirect("/")
    

    }
    
    
});
app.get("/work", function (req, res) {
    res.render("list",{listTitle: "Work List",newlistItems: workItems});

    
});
app.post("/work", function (req, res) {
    let item = req.body.newitem
    workItems.push(item)
    res.redirect("/work")
    
})








app.listen(3000, function () {
    console.log("Server running on 3000");
    
})