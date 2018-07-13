console.log("hello");

var headline="none";
var _id = "none"
$(".card-img-top").on("click", function(){
    _id = $(this).attr("db_id")
    console.log(_id);
    headline = $(this).attr("headline");
    $("#headline").text(headline);
    $("#results-modal").modal("toggle");
    //making a call for the article
   
    $.getJSON(`/articles/${_id}`, function(data){
        populateNoteSpace(data);

    });
});

$("#modalSubmit").on("click", function(){

 var note = $("#note").val().trim();
 console.log(note);
 var submitNote = {
     note: note
 }
 //sending note to backend 
 $.post(`/articles/${_id}`,submitNote,function(){
    console.log("Note Added!");
    // location.reload(true);
 });
});

// $.getJSON("article/")


function populateNoteSpace(item){
    console.log(item);
    if(item.note===undefined){
        $("#note-space").empty();
        $("#note-space").append(`<p>No notes so far!</p>`)
    }else
    {
    $("#note-space").empty();
    $("#note-space").append(`<p>${item.note.note}</p>`)

    }
}
