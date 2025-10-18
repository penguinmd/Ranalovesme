const request = require('supertest');
const { app, server } = require('../src/server');
const db = require('../src/models/database');
const fs = require('fs');
const path = require('path');

describe('Auth API', () => {
  beforeAll(async () => {
    // Wait a bit for database to initialize
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clean up test database
    await db.run('DELETE FROM users');
  });

  afterAll(async () => {
    await db.close();
    server.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'TestPass123',
          display_name: 'Test User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should fail with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          password: 'weak',
          display_name: 'Test User 2'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'TestPass123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
