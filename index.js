const express = require('express')
const app = express()
const mongoose = require('mongoose')

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

app.listen(3001, () => {
  console.log('Server running at port 3001')
})