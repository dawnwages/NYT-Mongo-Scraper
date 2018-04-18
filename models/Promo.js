var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var PromoSchema = new Schema({
  // `title` is of type String
  url: String,
  // `body` is of type String
  date: String,

});

var Promo = mongoose.model("Promo", PromoSchema);


module.exports = Promo;