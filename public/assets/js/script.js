
$(document).ready(function() {
    $(".dropdown-trigger").dropdown();
});

$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

var newScrape = {};
$("#scrape-url").on("click", function(event) {
event.preventDefault();
console.log("button pressed");
// Here we grab the form elements
newScrape = {
    url: "http://www3.lenovo.com/us/en/"+ $("#basic-url").val().trim(),
};
console.log(newScrape.url);
});