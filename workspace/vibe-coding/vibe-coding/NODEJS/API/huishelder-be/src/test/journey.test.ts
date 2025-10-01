import request from 'supertest';
import { App } from '@/app';
import { JourneyRoute } from '@routes/journey.route';
import { pool } from '@database';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '@/services/auth.service';

afterAll(async () => {
  await pool.end();
});

describe('Testing Journey API', () => {
  const app = new App([new JourneyRoute()]);
  const journeyRoute = new JourneyRoute();
  const appInstance = app.getServer();
  const authService = new AuthService();

  // Test user for API calls
  const testUserEmail = `journey-test-${uuidv4().substring(0, 8)}@example.com`;
  const testUserPassword = 'Password123!';
  let testUserId: string;
  let authToken: string;

  // Create a test user and get authentication token before tests
  beforeAll(async () => {
    // Create test user
    const userData = {
      email: testUserEmail,
      password: testUserPassword,
      name: 'Journey Test User',
    };

    const userResult = await authService.signup(userData);
    testUserId = userResult.id;

    // Get auth token
    const loginResult = await authService.login({ email: testUserEmail, password: testUserPassword });
    authToken = loginResult.token;
  });

  // Clean up test user after tests
  afterAll(async () => {
    // Delete test user and all related data (cascade delete)
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
  });

  describe('[POST] /api/v1/journey/init', () => {
    it('should initialize a new journey', async () => {
      const journeyData = {
        is_first_time_buyer: true,
        is_selling_current_home: false,
        has_bridge_loan: false,
      };

      const response = await request(appInstance)
        .post(`/api/v1${journeyRoute.path}/init`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(journeyData)
        .expect(200);

      expect(response.body.status).toEqual('success');
      expect(response.body.data.is_first_time_buyer).toBe(true);
      expect(response.body.data.is_selling_current_home).toBe(false);
      expect(response.body.data.has_bridge_loan).toBe(false);
    });

    it('should update an existing journey', async () => {
      const updatedJourneyData = {
        is_first_time_buyer: false,
        is_selling_current_home: true,
        has_bridge_loan: true,
      };

      const response = await request(appInstance)
        .post(`/api/v1${journeyRoute.path}/init`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedJourneyData)
        .expect(200);

      expect(response.body.status).toEqual('success');
      expect(response.body.data.is_first_time_buyer).toBe(false);
      expect(response.body.data.is_selling_current_home).toBe(true);
      expect(response.body.data.has_bridge_loan).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const journeyData = {
        is_first_time_buyer: true,
        is_selling_current_home: false,
        has_bridge_loan: false,
      };

      await request(appInstance).post(`/api/v1${journeyRoute.path}/init`).send(journeyData).expect(401);
    });
  });

  describe('[GET] /api/v1/journey/timeline', () => {
    it('should return the journey timeline', async () => {
      const response = await request(appInstance).get(`/api/v1${journeyRoute.path}/timeline`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(response.body.status).toEqual('success');
      expect(Array.isArray(response.body.data)).toBe(true);

      // Since we have a journey with selling and bridge loan, we should have more milestones
      expect(response.body.data.length).toBeGreaterThanOrEqual(6); // At least the 6 core milestones

      // Verify milestone structure
      const milestone = response.body.data[0];
      expect(milestone).toHaveProperty('id');
      expect(milestone).toHaveProperty('milestone');
      expect(milestone).toHaveProperty('is_complete');
      expect(milestone).toHaveProperty('tasks');
      expect(Array.isArray(milestone.tasks)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      await request(appInstance).get(`/api/v1${journeyRoute.path}/timeline`).expect(401);
    });
  });

  describe('[GET] /api/v1/journey/tasks', () => {
    it('should return the journey tasks', async () => {
      const response = await request(appInstance).get(`/api/v1${journeyRoute.path}/tasks`).set('Authorization', `Bearer ${authToken}`).expect(200);

      expect(response.body.status).toEqual('success');
      expect(Array.isArray(response.body.data)).toBe(true);

      // We should have some tasks
      expect(response.body.data.length).toBeGreaterThan(0);

      // Verify task structure
      const task = response.body.data[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('milestone');
    });

    it('should return 401 without authentication', async () => {
      await request(appInstance).get(`/api/v1${journeyRoute.path}/tasks`).expect(401);
    });
  });

  describe('[POST] /api/v1/journey/tasks/:id/complete', () => {
    it('should mark a task as complete', async () => {
      // First get a task to complete
      const tasksResponse = await request(appInstance).get(`/api/v1${journeyRoute.path}/tasks`).set('Authorization', `Bearer ${authToken}`);

      const taskId = tasksResponse.body.data[0].id;

      // Now complete the task
      const response = await request(appInstance)
        .post(`/api/v1${journeyRoute.path}/tasks/${taskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toEqual('success');

      // Verify the task is now complete
      const updatedTasksResponse = await request(appInstance).get(`/api/v1${journeyRoute.path}/tasks`).set('Authorization', `Bearer ${authToken}`);

      const completedTask = updatedTasksResponse.body.data.find(t => t.id === taskId);

      // The task should not be in the list anymore as we only return non-complete tasks
      expect(completedTask).toBeUndefined();
    });

    it('should return 401 without authentication', async () => {
      await request(appInstance).post(`/api/v1${journeyRoute.path}/tasks/some-task-id/complete`).expect(401);
    });

    it('should return 404 for non-existent task', async () => {
      await request(appInstance)
        .post(`/api/v1${journeyRoute.path}/tasks/${uuidv4()}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('[GET] /api/v1/journey/finance/summary', () => {
    it('should return financial summary (empty at first)', async () => {
      const response = await request(appInstance)
        .get(`/api/v1${journeyRoute.path}/finance/summary`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toEqual('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('user_journey_id');
    });

    it('should return 401 without authentication', async () => {
      await request(appInstance).get(`/api/v1${journeyRoute.path}/finance/summary`).expect(401);
    });
  });

  describe('[POST] /api/v1/journey/finance/summary', () => {
    it('should update financial summary', async () => {
      const financialData = {
        estimated_mortgage: 350000,
        monthly_gross: 1500,
        monthly_net: 1200,
      };

      const response = await request(appInstance)
        .post(`/api/v1${journeyRoute.path}/finance/summary`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(financialData)
        .expect(200);

      expect(response.body.status).toEqual('success');
      expect(response.body.data).toHaveProperty('estimated_mortgage', 350000);
      expect(response.body.data).toHaveProperty('monthly_gross', 1500);
      expect(response.body.data).toHaveProperty('monthly_net', 1200);
    });

    it('should return 401 without authentication', async () => {
      await request(appInstance).post(`/api/v1${journeyRoute.path}/finance/summary`).send({ estimated_mortgage: 400000 }).expect(401);
    });
  });

  // Note: We're not testing document upload as it requires multipart form handling
  // which complicates the test setup. In a real situation, we would mock the file upload.
});
