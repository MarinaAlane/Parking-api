const mongoose = require('mongoose');

const parking = new mongoose.Schema({
  plate: String,
  entrance: Date,
  exit: Date,
  paid: Boolean,
  Reservation_code: String,
});

module.exports = parking;
