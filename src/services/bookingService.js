const prisma = require('../utils/prisma');

async function createBooking(userId, data) {
  const { title, date } = data;

  if (!title || !date) {
    const error = new Error('Title and date are required');
    error.statusCode = 400;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      title,
      date: new Date(date),
      userId,
    },
  });

  return booking;
}

async function getBookings(user) {
  if (user.role === 'admin') {
    return prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  createBooking,
  getBookings,
};
