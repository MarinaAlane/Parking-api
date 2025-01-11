const mongoose = require('mongoose');

const parking = new mongoose.Schema({
  plate: {
    type: String,
    required: true
  },
  entrance: Date,
  exit: Date,
  paid: Boolean,
  Reservation_code: String,
  ParkingId: {
    type: Number,
    unique: true,
  }
});

module.exports = parking;
