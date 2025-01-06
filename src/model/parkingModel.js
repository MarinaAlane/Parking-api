const mongoose = require('mongoose');
const parkingSchema = require('../db/schemas');

const Parking = mongoose.model('Parking', parkingSchema);

module.exports = Parking;