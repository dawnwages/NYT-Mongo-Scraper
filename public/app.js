const randomDate = "02/23/1999";
const randomFormat = "MM/DD/YYYY";
const convertedDate = moment(randomDate, randomFormat);

//moment("1454521239279", "x").format("DD MMM YYYY hh:mm a") //parse string


$(document).ready(function(){
  $('.modal').modal();
});

function scrapeModal() {
  var modal = $(".modal-content")
  modal.append("<h4>Please be patient as we query the universe</h4><p><div class='fa fa-spinner fa-spin' style='font-size:78px'></div></p><p>loading...</p>");
  $('.modal').modal('open');
}














// Grab the articles as a json
function renderPromos() {
  $.getJSON("/promo", function(data) {
  // For each one
  if (data.length==0) {
  $("#promo").empty();
  $("#promo").html("<div class=''><p><h3>Welcome!</h3> There are no previous promo queries. <br> Select a url from the dropdown in the navigation and click the button to get started.</p></div>");
  } else {
    //$("#promo").empty();
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#promo").append(
        "<p class='promo' data-id='" 
        + data[i]._id + "'>" 
        + moment(data[i].date, "x").format("DD MMM YYYY hh:mm a") + "<br />" 
        + data[i].url + "</p>");
    }
  }

});
}

// Grab the articles as a json
function renderArticles() {
  $.getJSON("/articles", function(data) {
    if(data.length==0){
      $("#articles").empty();
     // $("#articles").html("<p>no articles</p>");
      $("#articles").html("<div class='row'><div id='articles' class='col s6'></div><div id='notes' class='col s6'></div></div><div id='noresults' class='row'><div class='col s12 m12'><div class='card-panel grey'><span class='center white-text'><h3>Uh Oh. No Results.</h3><p>Please insert the desired url string and click Scrape Now! to pull promo data.</p></span></div></div></div></div>");
    } else{
    // For each one
      $("#articles").empty();
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p class='articles "+data[i].promo+"' data-id='" + data[i]._id + "'><i class='far fa-sticky-note' style='font-size:24px'></i>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
    }
});
}

renderPromos();
//renderArticles();


// Whenever someone clicks a p tag
$(document).on("click", ".promo", function() {
  // Empty the notes from the note section
  $("#articles").empty();
  $("#notes").empty();
  $(".promo").css("color","black");
  $(this).css("color","#fff");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/promo/"+thisId,
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      //renderArticles();
     $("#articles").empty();
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
      $("#articles").append("<p class='articles "+data[i].promo+"' data-id='" + data[i]._id + "'> <i class='far fa-sticky-note' style='font-size:24px'></i>" + data[i].title + "<br />" + data[i].link + "</p>");
     }
    });
});







// Whenever someone clicks an articles tag
$(document).on("click", ".articles", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $(".articles").css("color","black");
  $(this).css("color","#fff");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<i class='far fa-sticky-note' style='font-size:48px'></i> <h5>Add notes about this MTM on this day</h5>");
      $("#notes").append("<b>" + data.title + "</b>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });

});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});




// =======================================================
//SCRIPT.JS
//========================================================



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
  scrapeModal();
  // Here we grab the form elements
  var newScrape = new Newscrape ($("#basic-url").val().trim(), Date.now());
  console.log(newScrape.url);
  console.log(newScrape.date);
  //return newScrape;

  $.post("/promo", newScrape, function() { 
       
      
  }).then(
    window.location.href = "/scrape"
  );
  //scrapeURL();
  
 //goHome();
  // Grab the articles as a json

});

var scrapeURL = function() {
  window.location.href = "/scrape";
  console.log("scrape complete");
};

var goHome = function(){
  window.location.href = "/";
  renderPromos();
  renderArticles();
};
