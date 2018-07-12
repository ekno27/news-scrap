//dependencies 
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cheerio = require("cheerio"); 

var request= require("request");


/**
 * 
 * SERVER CONFIG
 * 
 * 
*/
var app = express();

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
//connect to mongodb
mongoose.connect("mongodb://localhost/musicArtilesdb");


/**
 * 
 * CHEERIO/AXIOS 
 * 
 * 
*/

//request to grab html from pitchfork
request("https://pitchfork.com/latest/", function(error,response,html){
    //load html into cheerio
    var $ = cheerio.load(html);
    console.log("data has been obtained");
    var results= [];

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
            Console.log(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            console.log(err);
          });


    });//end of each

    console.log("Scrape complete"); 


})
    
    


/**
 * 
 * ROUTES
 * 
 * 
*/


// listen
app.listen(PORT, function(){
    console.log("App running on port " +  PORT);
})

