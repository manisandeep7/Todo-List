const express=require("express");
const bp=require("body-parser");
const mongoose = require('mongoose');
const date=require(__dirname +"/date.js"); // to use my own module
const ps=require(__dirname +"/secrets.js"); 

const app=express();
app.use(express.static("public"));         // to serve static files (CSS)
app.use(bp.urlencoded({extended :true}));  // to handle posts
app.set('view engine','ejs');              // using express for setting ejs as view engine

//  "mongodb://localhost:27017/todo-listDB"

mongoose.connect("mongodb+srv://user1:" + ps.getkey() + "@cluster0.vd5ft.mongodb.net/todo-listDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema=new mongoose.Schema({
    name:
    {
        type:String,
        required:[true,"enter valid item"]

    }
})

const item= mongoose.model("item",itemSchema); // new collection

const item1=new item({
    name:"Coding"
});

const defaultItems=[item1];

// custom Lists.
const listSchema={
    name:String,
    items : [itemSchema]
}
const List=mongoose.model("List",listSchema);

// home page
app.get("/",function(req,res)
{
     day=date.getday();
     todaydate=date.getdate();
    item.find(function(err,items)
    {
       
            // items is a item collection,contains all records of item type.
            res.render('list',{listtitle :"today" ,newitem : items}); // will send rendered HTML to the clients (day+" "+todaydate)
        
    })
    
    
});

// get requests for custom lists .
app.get("/:customList",function(req,res)
{
    const customName=req.params.customList;
    List.findOne({name : customName},function(err,foundList)
    {
        if(!err)
        {
            if(!foundList)
            {
                const newList=new List({
                    name : customName,
                    items : defaultItems
                })
                newList.save();
                res.redirect("/"+ customName);
            }
            else
            {
               res.render("list",{listtitle: foundList.name , newitem : foundList.items })
               
            }
        }
    })
})

// to handle about route
app.get("/about",function(req,res)
{
    res.render('about');
})

// handles post requests to add an item to the list.
app.post("/",function(req,res)
{
    const  x=req.body.item;
    const ListName=req.body.button;
    const newItem=new item({
        name:x
    })
    if(ListName ==  "today")
    {
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name : ListName},function(err,foundList)
        {
            foundList.items.push(newItem);
            res.redirect("/"+ ListName);
        })
    }  
});


// handle post request to delete an item to the list.
app.post("/delete",function(req,res)
{
   const  id=req.body.checkbox;
    const ListName=req.body.listdel;
    if(ListName == "today")
    {
        item.findByIdAndRemove(id,function(err)
        {
            if(err) console.log(err);
            else res.redirect("/");
        })
    }
    else{
        // finding one item in the list collections ( by name ) and pulling it out.
        List.findOneAndUpdate({name : ListName},{$pull : {items : {_id : id}}}, {useFindAndModify: false},function(err,foundList)
        {
            if(err) console.log(err);
            else res.redirect("/"+ ListName);
        })
    }
    
})

// listens to the server
// process.env.port
app.listen(3000,function() {
    console.log("Server started!");
}) 


