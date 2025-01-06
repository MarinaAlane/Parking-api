const express = require('express')
const mongoose = require('mongoose')
const ParkingModel = require('./model/parkingModel')

const app = express()
app.use(express.json())

async function connectionToDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/parking-api');
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

connectionToDB();
const teste = new ParkingModel({
  plate: 'SGBL - 4889',
  entrance: new Date(),
  exit: new Date(),
  paid: true,
  Reservation_code: 'SADSSDSADSADAS',
});
teste.save();
app.listen(3001, () => {
  console.log('Server running at port 3001')
})