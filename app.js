//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const app = express();

var items=["order food","eat food","wash"];
var workitems=[];

///?retryWrites=true&w=majority
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://aley3mr:madac2010@cluster0.bz8rrhi.mongodb.net/todolistdb",{useNewUrlParser: true});

const itemschema={
  name:String
};

const item=mongoose.model("item",itemschema);

const ay=new item({
  name:"welcome to your todo list"
});

const yay=new item({
  name:"welcome to your todo list"
});
const hay=new item({
  name:"welcome to your todo list"
});
const def=[ay,yay,hay];

const listschema={
  name:String,
  items:[itemschema]
};

const list =mongoose.model("list",listschema);


app.get("/", function(req, res) {
  item.find({})
  .then(found => {
    if(found.length===0){
      item.insertMany(def);
      res.redirect("/");
    }
    res.render("list", {listTitle: "today", newListItems: found});
  })
  .catch(err => {
    console.error(err);
  });


  

});

app.get("/:listname",function(req,res){
 const listnames= _.capitalize(req.params.listname) ;

 list.findOne({name:listnames})
 .then(found => {
  if(!found){
    
const tems=new list({
  name:listnames,
  items:def
});
tems.save();
res.redirect("/"+listnames);
  }
  else{

    res.render("list", {listTitle: listnames, newListItems: found.items});
  }
})
.catch(err => {
  console.error(err);
});


});

app.post("/", function(req, res){

  const tt = req.body.newItem;
  const listnamee = req.body.list;

  const newit = new item({
    name:tt
  });

  if(listnamee==="today"){
    newit.save();
    res.redirect("/");
  }
  else{
    list.findOne({name:listnamee})
    .then(found => {
      found.items.push(newit);
      found.save();
      res.redirect("/"+listnamee);
    })
    
.catch(err => {
  console.error(err);
});
  }
    
});

app.post("/delete",function(req,res){
 const checkeditem=req.body.checkbox;
 const listnamee=req.body.listname;

 if(listnamee==="today"){
  
 item.findByIdAndDelete(checkeditem)
 .then(deletedItem => {
   if (deletedItem) {
     console.log("Deleted Item:", deletedItem);
   }
   res.redirect("/");
 })
 .catch(err => {
   console.error("Error deleting item:", err);
   
 });

 }
 else{
  list.findOneAndUpdate({name:listnamee},{$pull:{items:{_id:checkeditem}}})
  .then(found=>{
    res.redirect("/"+listnamee);
  });

 }


});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});
app.listen(process.env.PORT||3000, function() {
  console.log("Server is running on port 3000");
});