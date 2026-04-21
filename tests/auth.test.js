const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/utils/prisma');

describe('Auth API', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = '123456';

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: testEmail,
      password: testPassword,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.token).toBeDefined();
  });

  it('should login an existing user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.token).toBeDefined();
  });

  it('should reject access to protected route without token', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Not authorized, no token provided');
  });
});
