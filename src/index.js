const express = require('express');
const mongoose = require('mongoose');
const parkingRoutes = require('./routes/routes');

const app = express();
app.use(express.json());

const PORT = 3001;

async function connectionToDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/parking-api');
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

connectionToDB();

app.use('/parking', parkingRoutes);
app.use('/parking/:id/out', parkingRoutes);
app.use('/parking/:id/pay', parkingRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
