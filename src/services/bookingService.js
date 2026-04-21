const prisma = require('../utils/prisma');

async function createBooking(userId, data) {
  const { title, date } = data;

  const booking = await prisma.booking.create({
    data: {
      title,
      date: new Date(date),
      userId,
    },
  });

  return booking;
}

module.exports = {
  createBooking,
};
