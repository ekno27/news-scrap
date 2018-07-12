var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//  result.headline = headLine;
// result.link = link;
// result.author = author;
// result.thumbnail = thumbnail;

//constructor 
var MusicArticleSchema = new Schema({
    //unique and dropdubs should prevent duplicates 
    headline:{
        type:String,
        required:true,
        unique:true,
        dropDups: true
    },
    link: {
        type:String,
        required:true,
        unique: true,
        dropDups: true
    },
    author:{
        type:String,
        required:true,
        dropDups: true
    },
    thumbnail:{
        type:String,
        required:true,
        dropDups: true
    },
    note:{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }

});

//create model from schema 
var MusicArticle = mongoose.model("MusicArticle", MusicArticleSchema);

module.exports = MusicArticle;