var express = require('express'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
app = express();

mongoose.connect("mongodb://localhost/blog_app");
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});
var Blog  = mongoose.model("Blog", blogSchema);

//ROOT Route
app.get('/',function(req, res){
   res.redirect('/blogs'); 
});

//INDEX Route
app.get('/blogs',function(req, res){
    Blog.find({}, function(Error, blogs){
        if(Error){
            console.log(Error);
        }else{
            res.render('index', {blogs : blogs});
        }
    });
});

//NEW Route
app.get('/blogs/new', function(rq,res){
    res.render('new');
});

//CREATE Route
app.post('/blogs', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(Error, newBlog){
        if(Error){
            console.log(Error);
        }else{
            res.redirect('/blogs');
        }
    });
});

//SHOW Route
app.get('/blogs/:id', function(req,res){
     Blog.findById(req.params.id, function(Error, foundBlog){
        if(Error){
            console.log(Error);
        }else{
            res.render('show', {blog : foundBlog});
        }
     });
});

//EDIT Route
app.get('/blogs/:id/edit',function(req, res){
    Blog.findById(req.params.id, function(Error, foundBlog){
        if(Error){
            console.log(Error);
        }else{
            res.render('edit', {blog : foundBlog});
        }
    })
});

//UPDATE Route
app.put('/blogs/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(Error, updatedBlog){
        if(Error){
            console.log(Error);
        }else{
            res.redirect('/blogs/'+ req.params.id);
        }
    });
});

//DESTROY Route
app.delete('/blogs/:id',function(req, res){
      Blog.findByIdAndRemove(req.params.id, function(Error){
        if(Error){
            console.log(Error);
        }else{
            res.redirect('/blogs');
        }
    });
});

app.listen('3001',function(req, res){
    console.log("Server has started");
});