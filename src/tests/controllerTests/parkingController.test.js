const { generateReservationCode, formattedHistory, createdParkingId } = require('../../controller/parkingController');
const moment = require('moment');

describe('Parking Controller', () => {
  describe('generateReservationCode', () => {
    it('should generate a reservation code with a timestamp and random number', () => {
      const code = generateReservationCode();
      const parts = code.split('-');
      expect(parts.length).toBe(2);
      expect(Number(parts[0])).not.toBeNaN();
      expect(Number(parts[1])).not.toBeNaN();
    });
  });

  describe('formattedHistory', () => {
    it('should format parking history correctly', () => {
      const parkings = [
        { ParkingId: 1, entrance: moment().subtract(2, 'hours').toISOString(), exit: moment().subtract(1, 'hours').toISOString(), paid: true, left: true },
        { ParkingId: 2, entrance: moment().subtract(30, 'minutes').toISOString(), exit: null, paid: false, left: false }
      ];
      const history = formattedHistory(parkings);
      expect(history.length).toBe(2);
      expect(history[0].time).toBe('1 horas e 0 minutos');
      expect(history[1].time).toBe('30 minutos');
    });

    it('should handle parking without exit time', () => {
      const parkings = [
        { ParkingId: 1, entrance: moment().subtract(1, 'hours').toISOString(), exit: null, paid: false, left: false }
      ];
      const history = formattedHistory(parkings);
      expect(history.length).toBe(1);
      expect(history[0].time).toBe('1 horas e 0 minutos');
    });
  });

  describe('createdParkingId', () => {
    it('should increment parking ID', () => {
      const id1 = createdParkingId();
      const id2 = createdParkingId();
      expect(id2).toBe(id1 + 1);
    });
  });
});
