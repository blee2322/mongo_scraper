var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var axios = require('axios');
var exphbs = require("express-handlebars");
var path = require('path');
var logger = require('morgan');

var db = require('./models')

var PORT = 3000;

var app= express();

//Handlebars====================================================
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: path.join(__dirname,'/views/layouts/partials')
}));
app.set('view engine', 'handlebars');
//==============================================================

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/NYT', {
  useMongoClient:true
});

//======Routes====================
//Render Handlebars
app.get('/', function(req, res) {
  db.Article.find({'saved': false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    res.render('index', hbsObject);
  })
});

app.get('/saved', function(req, res) {
  db.Article.find({'saved': true}, function(error, data) {
    var hbsObject = {
      article: data
    };
    res.render('saved', hbsObject);
  })
});

app.get('/scrape', function(req, res) {
  console.log('/scrape hit')
  axios.get('http://www.nytimes.com').then(function(response){

    var $ = cheerio.load(response.data);
    var tracker = 0;  
    var total = $('article.theme-summary').length;
    console.log(total)
    $('article.theme-summary').each(function(i, element) {

      var result = {};

      result.title = $(this)
        .children('h2.story-heading')
        .text();
      result.link = $(this)
        .children('h2.story-heading')
        .children('a')
        .attr('href');
      result.summary = $(this)
        .children('.summary')
        .text();
        if (result.title!==''){

          db.Article
            .create(result)
            .then(function(dbArticle) {
              tracker ++;  
              if (tracker === total){
                res.send("done scraping")
              }
            })
            .catch(function(err) {
              res.json(err);
            });
          console.log(result)
        }

        
    });
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article
    .find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Route for saving an article
app.post('/articles/save/:id', function(req, res){

  db.Article
    .findOneAndUpdate({'_id': req.params.id}, {'saved': true})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    })
});

//Route for deleting article
app.post('/articles/delete/:id', function(req, res) {
  db.Article
    .findOneAndUpdate({'_id': req.params.id}, {'saved': false, 'notes': []})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    })

})

// Route for saving/updating an Article's associated Note
app.post("/notes/save/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// 
app.delete('/notes/delete/:note_id/:article_id', function(req, res) {
  db.Note
    .findOneAndRemove({'_id': req.params.note})
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {

      res.json(err);
    })
})
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});