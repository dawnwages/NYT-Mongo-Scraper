var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//var newPromo = require("./public/assets/js/script");

// Initialize Express
var app = express();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


var url = "";


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
//creates database when named 

const databaseUri = 'mongodb://localhost/scraperDemo'

if(process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGO_DB_URI);
} else {
  mongoose.connect(databaseUri);
}

var aa = mongoose.connection;

aa.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

aa.once('open', function(){
  console.log('Mongoose connection successful.');
});



app.post("/promo", function(req, res) {
    // Create a new Article using the `result` object built from scraping
      console.log(req.body);

      db.Promo.create(req.body)
      .then(function(dbPromo) {
        // View the added result in the console
        console.log(dbPromo);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });

});

app.get("/promo", function(req, res) {
    // Grab every document in the Articles collection
    db.Promo.find({})
    .then(function(dbPromo) {
      res.json(dbPromo);
    });
});

// Routes
// When refactor, split out routes (HTML AND API) into a folder like you did in friend finder 
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request

    db.Promo.find({})
    .then(function(dbPromo){
    let r = dbPromo.pop();
    console.log(r.url);
    console.log(r._id);

            axios.get("http://www3.lenovo.com"+r.url ).then(function(response) {
              // Then, we load that into cheerio and save it to $ for a shorthand selector
              var $ = cheerio.load(response.data);

              // Now, we grab every h2 within an article tag, and do the following:
              $(".product-title").each(function(i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                  .children("a")
                  .text();
                result.link = $(this)
                  .children("a")
                  .attr("href");

                result.promo = r._id;

                console.log(result);

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                  .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                    res.redirect('/');
                  })
                  .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                  });
                

              });

              // If we were able to successfully scrape and save an Article, send a message to the client
              //res.send("Scrape Complete");
              

            });


    });
  

});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
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
app.get("/articles/promo/:promo?", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  if (req.params.promo) {
    // Then display the JSON for ONLY that character.
    // (Note how we're using the ORM here to run our searches)
    db.Article.find({
        "promo" : req.params.promo
    }).then(function(result) {
      return res.json(result);
    });
  }
  else {
    // Otherwise...
    // Otherwise display the data for all of the characters.
    // (Note how we're using Sequelize here to run our searches)
    db.Article.findAll({}).then(function(result) {
      return res.json(result);
    });
  }
  
  
  
  // db.Article.findOne({ _id: req.params.id })
  //   // ..and populate all of the notes associated with it
  //   .populate("note")
  //   .then(function(dbArticle) {
  //     // If we were able to successfully find an Article with the given id, send it back to the client
  //     res.json(dbArticle);
  //   })
  //   .catch(function(err) {
  //     // If an error occurred, send it to the client
  //     res.json(err);
  //   });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
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

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ 
        _id: req.params.id 
      }, 
      { note: dbNote._id 
      }, 
      { new: true });
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


//Start the server
app.listen(process.env.PORT || 5000, function() {
  console.log("App running on port " + PORT + "!");
});
