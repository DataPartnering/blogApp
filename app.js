 var express = require("express");
 var app = express();
 var mongoose = require("mongoose");
 var bodyParser = require("body-parser");
 var methodOverride = require("method-override");
 var expressSanitizer = require("express-sanitizer");
 
 //Mongoose/Model Config
 //mongoose.connect("mongodb://localhost/blog_app");
 
 mongoose.connect("mongodb://Jovan:Jovandev55@ds143604.mlab.com:43604/jovansblogapp");
 
 app.set("view engine","ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(methodOverride("_method"));
 app.use(expressSanitizer());
 
 
 var blogSchema = new mongoose.Schema({
     title: String,
     image: String,
     body: String,
     created: {type:Date, default: Date.now}
 })
 var Blog = mongoose.model("Blog", blogSchema);
 
 
 //Restful routes
 app.get("/", function(req, res) {
     res.redirect("/blogs");
 });
// New Route
app.get("/blogs/new", function(req, res){
  res.render("new");
});
//Create Route
app.post("/blogs", function(req,res){
 //create blog
 req.body.blog.body = req.sanitize(req.body.blog.body)
 Blog.create(req.body.blog,function(err,newBlog){
  if (err){
   res.render("new");
  } else {
   // then, redirect to the index
 res.redirect("/blogs");
  }
 });
});
 app.get("/blogs", function(req, res){
  Blog.find({}, function(err,blogs){
   if(err){
    console.log("error!")
   } else{
        res.render("index", {blogs: blogs});
   }
  });
 });
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
 Blog.findById(req.params.id, function(err,foundBlog){
 if(err){
 res.redirect("/blogs");
} else{
    res.render("show", {blog: foundBlog});
   }
 });
});
//Edit ROUTE
app.get("/blogs/:id/edit", function(req, res){
 Blog.findById(req.params.id, function(err, foundBlog){
   if(err){
 res.redirect("/blogs");
} else{
    res.render("edit", {blog: foundBlog});
   }
 });
 });
 //UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
 req.body.blog.body = req.sanitize(req.body.blog.body)
 Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
  if(err){
   res.redirect("/blogs");
     } else {
      res.redirect("/blogs/" + req.params.id);
     }
 });
});
//Delete ROUTE
app.delete("/blogs/:id", function(req, res){
 //Destroy Blog
 Blog.findByIdAndRemove(req.params.id, function(err){
 //Redirect Somewhere
  if(err){
   res.redirect("/blogs");
  } else {
   res.redirect("/blogs");
  }
 })
})


const PORT = process.env.PORT || 3000;

 app.listen(PORT,process.env.IP, function(){
          console.log("server is running on port 3000")
 });
 
 
