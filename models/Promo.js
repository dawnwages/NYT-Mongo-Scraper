var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PromoSchema = new Schema({
  // `title` is required and of type String
  name: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  part: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
    //Create notes about each product. This is the note id number.
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Promo = mongoose.model("Promo", PromoSchema);

// Export the Article model
module.exports = Promo;
