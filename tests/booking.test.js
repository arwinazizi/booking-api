const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/utils/prisma');

describe('Booking API', () => {
  const testEmail = `booking_${Date.now()}@example.com`;
  const testPassword = '123456';

  let token;
  let createdBookingId;

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Booking User',
        email: testEmail,
        password: testPassword,
      });

    token = registerResponse.body.token;
  });

  afterAll(async () => {
    if (createdBookingId) {
      await prisma.booking.deleteMany({
        where: {
          id: createdBookingId,
        },
      });
    }

    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  it('should create a booking for authenticated user', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Booking',
        date: '2026-05-01T10:00:00.000Z',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.title).toBe('Test Booking');

    createdBookingId = response.body.data.id;
  });

  it('should return bookings for authenticated user', async () => {
    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it('should update own booking', async () => {
    const response = await request(app)
      .put(`/api/bookings/${createdBookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Booking',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.title).toBe('Updated Test Booking');
  });

  it('should delete own booking', async () => {
    const response = await request(app)
      .delete(`/api/bookings/${createdBookingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Booking deleted successfully');
  });
});
