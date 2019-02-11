var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var campground = require("./models/campground.js");
var comments = require("./models/comment.js");
var seedDB = require("./seedDB.js");

//connect mongoose to db
mongoose.connect("mongodb://localhost:27017/yelp_camps",{useNewUrlParser: true});




//create an object
// campground.create(
//     {"name":"Kabini","image":"https://farm7.staticflickr.com/6024/5983677310_ab336ba1a3.jpg","description":"This is an serene place on the bank of river kabini"}, function(err,campground){
//     if(err)
//     {
//         console.log("eroor message " + err);
//     }
//     else
//     {
//         console.log("object created successfully");
//         console.log(campground);
//     }
// });

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

//setting global variable till we figure out database
//   var camping_grounds= [
//         {"name":"kabini","image":"https://farm5.staticflickr.com/4270/34539336903_03e5795477.jpg"},
//     {"name":"wayanad","image":"https://farm7.staticflickr.com/6024/5983677310_ab336ba1a3.jpg"},
//     {"name":"coorg","image":"https://farm3.staticflickr.com/2080/2281548894_1a3fe54539.jpg"},
//     ];

//seed data base with new grounds
//seedDB();

app.get("/",function(req, res){
    
    res.render("yelpLanding");
    
});

//index route
app.get("/Camps", function(req,res){
 
    //res.send(" hi there");
    campground.find({},function(err,allcampground){
        if(err)
        {
            console.log(err);
            res.redirect("/")
        }
        else
        {
            res.render("yelpCamps",{camping_grounds:allcampground});
            
        }
    });
    
});

//create route
app.post("/Camps",function(req,res){
    var camp_name = req.body.name;
    var camp_image = req.body.image;
    var camp_desc = req.body.camp_desc;
    var camp_ground = {name:camp_name,image:camp_image, description:camp_desc};
    //camping_grounds.push(camp_ground);
    campground.create(camp_ground, function(err,campgroundobject)
    {
        if(err)
        {
          console.log(err);  
        }
        else
        {
          res.redirect("/camps");  
        }
    });
    
});

// new route
app.get("/Camps/new", function(req, res) {
    res.render("newCamp");
});


// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground: foundCampground});
           
        }
    });
})

//Comments route
app.get("/campgrounds/:id/comments/new", function(req, res) {
    
    var camp_id= req.params.id;
    campground.findById(camp_id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
           res.render("comments/new",{campground:campground}); 
        }
    });
    
    //res.send("You have reached the comments new form");
    
});


app.post("/campgrounds/:id/comments", function(req,res){
    var camp_id = req.params.id;
    campground.findById(camp_id,function(err,campground)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/camps"); 
        }
        else
        {
           comments.create(req.body.comments, function(err,commentsobj){
               if(err)
               {
                   console.log(err);
                   res.redirect("/camps"); 
               }
               else
               {
                   console.log(commentsobj);
                   campground.comments.push(commentsobj);
                   campground.save();
                   res.redirect("/campgrounds/" + camp_id);  
               }
           });
           
        }
    });
    
});

//listener
app.listen(process.env.PORT,process.env.IP,function()
{
   console.log("server started"); 
});