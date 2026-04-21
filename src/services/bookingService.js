const prisma = require('../utils/prisma');

async function createBooking(userId, data) {
  const { title, date } = data;

  if (!title || !date) {
    const error = new Error('Title and date are required');
    error.statusCode = 400;
    throw error;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    const error = new Error('Invalid date');
    error.statusCode = 400;
    throw error;
  }

  const booking = await prisma.booking.create({
    data: {
      title,
      date: parsedDate,
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

async function getBookingById(id) {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  return booking;
}

function ensureBookingAccess(user, booking) {
  const isOwner = booking.userId === user.id;
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: insufficient permissions');
    error.statusCode = 403;
    throw error;
  }
}

async function updateBooking(id, user, data) {
  const booking = await getBookingById(id);

  ensureBookingAccess(user, booking);

  if (!data.title && !data.date) {
    const error = new Error('At least one field (title or date) is required');
    error.statusCode = 400;
    throw error;
  }

  let parsedDate = booking.date;

  if (data.date) {
    parsedDate = new Date(data.date);

    if (Number.isNaN(parsedDate.getTime())) {
      const error = new Error('Invalid date');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      title: data.title ?? booking.title,
      date: parsedDate,
    },
  });

  return updatedBooking;
}

async function deleteBooking(id, user) {
  const booking = await getBookingById(id);

  ensureBookingAccess(user, booking);

  await prisma.booking.delete({
    where: { id },
  });

  return { message: 'Booking deleted successfully' };
}

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
};
