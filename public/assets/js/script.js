$(document).ready(function() {
    $('select').material_select();
  });
        



$(document).ready(function() {
    $(".dropdown-trigger").dropdown();
});

$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

function Newscrape(url, date){
    this.url = url;
    this.date = date;
}

//var newScrape = {
//    url: "/us/en/landingpage/promotions/weekly-sale/lenovo-laptops",
//    date: Date.now(),
//};

$("#scrape-url").on("click", function(event) {
    event.preventDefault();
    console.log("button pressed");
    // Here we grab the form elements
    var newScrape = new Newscrape ($("#basic-url").val().trim(), Date.now());
    console.log(newScrape.url);
    console.log(newScrape.date);
    //return newScrape;

    $.post("/api/urlreq", newScrape,
    function(data) {
     //   $('#queryModal').modal('open');
    });
});







//console.log(newScrape.url);
//console.log(newScrape.date);


