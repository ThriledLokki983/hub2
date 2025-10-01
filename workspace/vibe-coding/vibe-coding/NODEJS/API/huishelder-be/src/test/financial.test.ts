import request from 'supertest';
import { App } from '@/app';
import FinancialRoute from '@routes/financial.route';

describe('Financial API Endpoints', () => {
  describe('[POST] /api/v1/financial-snapshot', () => {
    it('should create a financial snapshot', async () => {
      const financialRoute = new FinancialRoute();
      const app = new App([financialRoute]);

      // Test user credentials for authentication
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Login first to get authorization token
      const loginResponse = await request(app.getServer())
        .post('/api/v1/auth/login')
        .send(userData);

      const token = loginResponse.body.data.token;

      // Now test the financial snapshot endpoint
      const financialData = {
        current_home_value: 450000,
        current_mortgage_left: 300000,
        new_home_price: 600000,
        interest_rate: 3.5,
        fixed_term_years: 20,
        monthly_income: 5500,
        include_nhg: true,
        extra_savings: 20000
      };

      // Send request with auth token
      const response = await request(app.getServer())
        .post('/api/v1/financial-snapshot')
        .set('Authorization', `Bearer ${token}`)
        .send(financialData);

      // Test for success response with calculated values
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('estimated_mortgage');
      expect(response.body.data).toHaveProperty('estimated_boeterente');
      expect(response.body.data).toHaveProperty('bridge_loan_amount');
      expect(response.body.data).toHaveProperty('total_buyer_costs');
      expect(response.body.data).toHaveProperty('monthly_payment_gross');
      expect(response.body.data).toHaveProperty('monthly_payment_net');
    });

    it('should return 401 without authorization', async () => {
      const financialRoute = new FinancialRoute();
      const app = new App([financialRoute]);

      const financialData = {
        current_home_value: 450000,
        current_mortgage_left: 300000,
        new_home_price: 600000,
        interest_rate: 3.5,
        fixed_term_years: 20,
        monthly_income: 5500,
        include_nhg: true,
        extra_savings: 20000
      };

      const response = await request(app.getServer())
        .post('/api/v1/financial-snapshot')
        .send(financialData);

      expect(response.status).toBe(401);
    });

    it('should return 400 with missing data', async () => {
      const financialRoute = new FinancialRoute();
      const app = new App([financialRoute]);

      // Test user credentials for authentication
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Login first to get authorization token
      const loginResponse = await request(app.getServer())
        .post('/api/v1/auth/login')
        .send(userData);

      const token = loginResponse.body.data.token;

      // Send request with auth token but incomplete data
      const response = await request(app.getServer())
        .post('/api/v1/financial-snapshot')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // Missing required fields
          current_home_value: 450000
        });

      expect(response.status).toBe(400);
    });
  });

  describe('[GET] /api/v1/financial-snapshots', () => {
    it('should return financial snapshots for authenticated user', async () => {
      const financialRoute = new FinancialRoute();
      const app = new App([financialRoute]);

      // Test user credentials for authentication
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Login first to get authorization token
      const loginResponse = await request(app.getServer())
        .post('/api/v1/auth/login')
        .send(userData);

      const token = loginResponse.body.data.token;

      // Send request with auth token
      const response = await request(app.getServer())
        .get('/api/v1/financial-snapshots')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // Skip this test if you don't have test data in the database
  describe.skip('[GET] /api/v1/financial-snapshots/:id', () => {
    it('should return a specific financial snapshot', async () => {
      const financialRoute = new FinancialRoute();
      const app = new App([financialRoute]);

      // Test user credentials for authentication
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Login first to get authorization token
      const loginResponse = await request(app.getServer())
        .post('/api/v1/auth/login')
        .send(userData);

      const token = loginResponse.body.data.token;

      // First create a snapshot to get an ID
      const financialData = {
        current_home_value: 450000,
        current_mortgage_left: 300000,
        new_home_price: 600000,
        interest_rate: 3.5,
        fixed_term_years: 20,
        monthly_income: 5500,
        include_nhg: true,
        extra_savings: 20000
      };

      const createResponse = await request(app.getServer())
        .post('/api/v1/financial-snapshot')
        .set('Authorization', `Bearer ${token}`)
        .send(financialData);

      const snapshotId = createResponse.body.data.id;

      // Now retrieve the specific snapshot
      const response = await request(app.getServer())
        .get(`/api/v1/financial-snapshots/${snapshotId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(snapshotId);
    });
  });
});
});
