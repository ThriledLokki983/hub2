import request from 'supertest';
import { App } from '@/app';
import pg from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { AuthRoute } from '@routes/auth.route';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';

// Mock the database module
jest.mock('@database');

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  pg.end();
});

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const userData: CreateUserDto = {
        email: 'signup@example.com',
        password: 'password123456',
      };
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return await request(app.getServer()).post('/signup').send(userData).expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123456',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return await request(app.getServer())
        .post('/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      // Create mock token for authentication
      const token = sign({ id: 1 }, SECRET_KEY, { expiresIn: 60 * 60 });

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      // Set up pg mock to return a valid user for authentication
      const mockRows = [{ id: 1, email: 'test@example.com', password: 'hashedPassword' }];
      const mockQueryResult = { rows: mockRows, rowCount: 1 };
      pg.query = jest.fn().mockResolvedValue(mockQueryResult);

      return request(app.getServer())
        .post('/logout')
        .set('Cookie', `Authorization=${token}`) // Set auth cookie
        .expect('Set-Cookie', /^Authorization=\;/);
    });
  });
});
