const moment = require('moment');

const generateReservationCode = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomNumber}`;
}

const formattedHistory = (parkings) => {
  return parkings.map(parking => {
    const entryTime = moment(parking.entrance);
    const exitTime = parking.exit ? moment(new Date(parking.exit)) : moment(new Date());

    const minutesDiff = exitTime.diff(entryTime)
    const hours = Math.floor(moment.duration(minutesDiff).asHours());
    const minutes = Math.floor(moment.duration(minutesDiff).asMinutes()) - (hours * 60);

    const timeResults = () => {
      if (hours > 0) {
        return `${hours} horas e ${minutes} minutos`;
      } else {
        return `${minutes} minutos`;
      }
    }

    return {
      id: parking.ParkingId,
      time: timeResults(),
      paid: parking.paid,
      left: parking.left
    };
  });
}

let ParkingId = 1;
const createdParkingId = () => {
  return ParkingId++;
}

module.exports = { generateReservationCode, formattedHistory, createdParkingId };
