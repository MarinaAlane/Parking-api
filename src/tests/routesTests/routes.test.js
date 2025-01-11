const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Parking = require('../../model/parkingModel');
const router = require('../../routes/routes');

const app = express();
app.use(express.json());
app.use('/api/parking', router);

describe('Parking API Routes', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/parking_test_db`;
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Parking.deleteMany({});
  });

  describe('POST /api/parking', () => {
    it('should create a new parking entry', async () => {
      const res = await request(app)
        .post('/api/parking')
        .send({ plate: 'ABC-1234' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('reservationCode');
    });

    it('should return 400 if plate is missing', async () => {
      const res = await request(app)
        .post('/api/parking')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Placa é obrigatória');
    });

    it('should return 400 if plate format is invalid', async () => {
      const res = await request(app)
        .post('/api/parking')
        .send({ plate: 'INVALID' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Formato de placa inválido');
    });
  });

  describe('PUT /api/parking/:parkingId/out', () => {
    it('should register exit for a parking entry', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), paid: true, Reservation_code: '123456', ParkingId: '1' });
      await parking.save();

      const res = await request(app)
        .put(`/api/parking/${parking.ParkingId}/out`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Saída registrada com sucesso');
    });

    it('should return 404 if parking entry is not found', async () => {
      const res = await request(app)
        .put('/api/parking/999/out');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Registro não encontrado');
    });

    it('should return 400 if exit is already registered', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), exit: new Date(), paid: true, Reservation_code: '123456', ParkingId: '2' });
      await parking.save();

      const res = await request(app)
        .put(`/api/parking/${parking.ParkingId}/out`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Saída já registrada');
    });

    it('should return 402 if payment is pending', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), paid: false, Reservation_code: '123456', ParkingId: '3' });
      await parking.save();

      const res = await request(app)
        .put(`/api/parking/${parking.ParkingId}/out`);

      expect(res.statusCode).toEqual(402);
      expect(res.body).toHaveProperty('message', 'Pagamento pendente');
    });
  });

  describe('PUT /api/parking/:parkingId/pay', () => {
    it('should register payment for a parking entry', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), paid: false, Reservation_code: '123456', ParkingId: '4' });
      await parking.save();

      const res = await request(app)
        .put(`/api/parking/${parking.ParkingId}/pay`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Pagamento efetuado com sucesso');
    });

    it('should return 404 if parking entry is not found', async () => {
      const res = await request(app)
        .put('/api/parking/999/pay');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Registro não encontrado');
    });

    it('should return 400 if payment is already registered', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), paid: true, Reservation_code: '123456', ParkingId: '5' });
      await parking.save();

      const res = await request(app)
        .put(`/api/parking/${parking.ParkingId}/pay`);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Pagamento já efetuado');
    });
  });

  describe('GET /api/parking/:plate', () => {
    it('should return parking history for a given plate', async () => {
      const parking = new Parking({ plate: 'ABC-1234', entrance: new Date(), paid: true, Reservation_code: '123456', ParkingId: '6' });
      await parking.save();

      const res = await request(app)
        .get('/api/parking/ABC-1234');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return 404 if no parking history is found', async () => {
      const res = await request(app)
        .get('/api/parking/XYZ-9999');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Registro não encontrado');
    });

    it('should return 400 if plate format is invalid', async () => {
      const res = await request(app)
        .get('/api/parking/INVALID');

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Formato de placa inválido');
    });
  });
});