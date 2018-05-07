const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const phoneSchema = new Schema({
  brand: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  specs: { type: [ String ] }
}, {
  timestamps: true
});

const Phone = mongoose.model("Phone", phoneSchema);


module.exports = Phone;
