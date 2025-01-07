const router = require('express').Router();
const Parking = require('../model/parkingModel');
const generateReservationCode = require('../controller/parkingController');

router.post('/', async (req, res) => {
  try {
    const { plate } = req.body;

    if (!/^[A-Z]{3}-\d{4}$/.test(plate)) {
      return res.status(400).json({ message: 'Formato de placa inválido' });
    }

    const reservationCode = generateReservationCode();

    const parking = new Parking({
      plate,
      entrance: new Date(),
      exit: null,
      paid: false,
      Reservation_code: reservationCode,
    });

    await parking.save();

    res.status(201).json({ reservationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar entrada' });
  }
});

module.exports = router;
