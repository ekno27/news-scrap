//dependencies 
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cheerio = require("cheerio"); 
var request= require("request");
var exphbs = require("express-handlebars");





/**
 * SERVER CONFIG
*/
var app = express();

/*
Setup handlebars
*/

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var PORT = process.env.PORT || 8080;
// Set the app up with morgan.
app.use(logger("dev"));
// Setup the app with body-parser and a static folder
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());
// Set up a static folder (public) for our web app
app.use(express.static("public"));

//require models 
var db = require("./models");


//If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/musicArtilesdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


/**
 * CHEERIO/REQUEST 
*/

//function used to scrape website and add each item to the database
function scrapeWebsite(){
    //request to grab html from pitchfork
    request("https://pitchfork.com/latest/", function(error,response,html){
    //load html into cheerio
        var $ = cheerio.load(html);

        $("div.module").each(function(i, element){
            var result = {};

            //getting link to story
            var link ="https://pitchfork.com"+ $(element).children().find("a").attr("href");
            
            //finding headline and author 
            var headLine = $(element).children().find("h2.title").text();

            //finding author of story
            var author = $(element).children().find("ul.authors").find("span").text();

            //getting thumbnail 
            var thumbnail = $(element).children().find("img").attr("src"); 

            if(author==="by: "){
                author = "by: unknown";
            }

            //adding to object that will be pushed to database
            result.headline = headLine;
            result.link = link;
            result.author = author;
            result.thumbnail = thumbnail;

            // console.log(result);
            // console.log( i + " ======================================");

            db.MusicArticle.create(result).then(function(dbArticle){
                console.log(dbArticle);
                console.log("=============================================\n=============================================\n=============================================");
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                console.log(err);
                console.log("=============================================\n=============================================\n=============================================");
            });


        });//end of each

        console.log("Scrape complete"); 


    });
}
    
/**
 * ROUTES
*/
//home page route that will retrieve articles
app.get("/", function(req,res){
   
    db.MusicArticle.find({}).then(function(dbArticle){
        var articleObject ={};
        console.log(dbArticle);
        articleObject.dbArticle = dbArticle;
        res.render("index", articleObject);
    });    
})

//route to scrape data
app.get("/scrape", function(req,res){
    scrapeWebsite();
    res.redirect("/");
});

// listen
app.listen(PORT, function(){
    console.log("App running on port " +  PORT);
})

