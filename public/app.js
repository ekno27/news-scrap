console.log("hello");

var headline="none";
$(".headline").on("click", function(){
    headline = $(this).text();
    $("#headline").text(headline);

    $("#results-modal").modal("toggle");
});


