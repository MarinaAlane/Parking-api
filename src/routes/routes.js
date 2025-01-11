const router = require('express').Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Parking = require('../model/parkingModel');
const { generateReservationCode, formattedHistory } = require('../controller/parkingController');

router.post('/', async (req, res) => {
  try {
    const { plate } = req.body;

    if (!plate) {
      return res.status(400).json({ message: 'Placa é obrigatória' });
    }

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


router.put('/:id/out', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    if (parking.exit) {
      return res.status(400).json({ message: 'Saída já registrada' });
    }

    if (!parking.paid) {
      return res.status(402).json({ message: 'Pagamento pendente' });
    }

    parking.exit = new Date();

    await parking.save();

    res.status(200).json({ message: 'Saída registrada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar saída' });
  }
});

router.put('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const parking = await Parking.findById(id);

    if (!parking) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }

    if (parking.paid) {
      return res.status(400).json({ message: 'Pagamento já efetuado' });
    }

    parking.paid = true;

    await parking.save();

    res.status(200).json({ message: 'Pagamento efetuado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao efetuar pagamento' });
  }
});

router.get('/:plate', async (req, res) => {
  try {
    const { plate } = req.params;

    if (!plate) {
      return res.status(400).json({ message: 'Placa é obrigatória' });
    }

    if (!/^[A-Z]{3}-\d{4}$/.test(plate)) {
      return res.status(400).json({ message: 'Formato de placa inválido' });
    }

    const parkings = await Parking.find({ plate });

    if (!parkings || parkings.length === 0) {
      return res.status(404).json({ message: 'Registro não encontrado' });
    }


    res.status(200).json(formattedHistory(parkings));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar registro' });
  }
});



module.exports = router;
