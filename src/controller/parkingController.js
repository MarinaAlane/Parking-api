function generateReservationCode() {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomNumber}`;
}


module.exports = generateReservationCode;
