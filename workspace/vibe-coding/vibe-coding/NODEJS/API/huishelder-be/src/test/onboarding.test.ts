import request from 'supertest';
import { App } from '@/app';
import { AuthRoute } from '@/routes/auth.route';
import { CreateUserDto } from '@/dtos/users.dto';
import OnboardingRoute from '@/routes/onboarding.route';
import { GoalType, TimelineType } from '@/interfaces/onboarding.interface';

jest.mock('@/database', () => {
  const mockClient = {
    query: jest.fn(),
  };
  return {
    db: {
      query: jest.fn(),
      connect: jest.fn().mockResolvedValue(mockClient),
    },
    redisClient: {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    },
    initializeDatabase: jest.fn(),
  };
});

afterAll(async () => {
  jest.clearAllMocks();
});

describe('Testing Onboarding API', () => {
  describe('[GET] /api/v1/user/onboarding', () => {
    it('should return 401 error if not authenticated', async () => {
      const app = new App([new OnboardingRoute()]);

      return request(app.getServer()).get('/api/v1/user/onboarding').expect(401);
    });
  });

  describe('[POST] /api/v1/user/onboarding', () => {
    it('should return 401 error if not authenticated', async () => {
      const app = new App([new OnboardingRoute()]);
      const onboardingData = {
        goal: GoalType.BOTH,
        budget_min: 300000,
        budget_max: 500000,
        owns_home: true,
        has_existing_mortgage: true,
        timeline: TimelineType.THREE_TO_SIX_MONTHS,
      };

      return request(app.getServer()).post('/api/v1/user/onboarding').send(onboardingData).expect(401);
    });
  });

  describe('Onboarding Flow Integration', () => {
    it('should complete the full onboarding flow with authentication', async () => {
      // Mock the database responses
      const mockDb = require('@/database').db;
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

      // Mock user creation and authentication
      mockDb.query.mockImplementation((query, params) => {
        if (query.includes('INSERT INTO users')) {
          return {
            rows: [
              {
                id: mockUserId,
                email: 'test@example.com',
                name: 'Test User',
                onboarding_completed: false,
              },
            ],
          };
        } else if (query.includes('SELECT') && params?.includes('test@example.com')) {
          return {
            rows: [
              {
                id: mockUserId,
                password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456',
                email: 'test@example.com',
                name: 'Test User',
                onboarding_completed: false,
              },
            ],
          };
        } else if (query.includes('SELECT') && params?.includes(mockUserId)) {
          return {
            rows: [
              {
                id: mockUserId,
                email: 'test@example.com',
                name: 'Test User',
                onboarding_completed: false,
              },
            ],
          };
        } else if (query.includes('INSERT INTO user_onboarding') || query.includes('UPDATE user_onboarding')) {
          return { rows: [{}] };
        } else if (query.includes('UPDATE users SET onboarding_completed')) {
          return { rows: [{}] };
        } else if (query.includes('SELECT onboarding_completed')) {
          return {
            rows: [
              {
                onboarding_completed: true,
              },
            ],
          };
        } else if (query.includes('SELECT goal, budget_min')) {
          return {
            rows: [
              {
                goal: GoalType.BOTH,
                budget_min: 300000,
                budget_max: 500000,
                owns_home: true,
                has_existing_mortgage: true,
                timeline: TimelineType.THREE_TO_SIX_MONTHS,
              },
            ],
          };
        } else {
          return { rows: [] };
        }
      });

      // Set up app with routes
      const app = new App([new AuthRoute(), new OnboardingRoute()]);

      // 1. Create a user
      const userData: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
        language_preference: 'en',
      };

      // 2. Login to get auth token
      const loginResponse = await request(app.getServer()).post('/api/v1/auth/login').send({ email: 'test@example.com', password: 'password123' });

      expect(loginResponse.status).toBe(200);
      const token = loginResponse.body.data.token;

      // 3. Submit onboarding data
      const onboardingData = {
        goal: GoalType.BOTH,
        budget_min: 300000,
        budget_max: 500000,
        owns_home: true,
        has_existing_mortgage: true,
        timeline: TimelineType.THREE_TO_SIX_MONTHS,
      };

      const onboardingResponse = await request(app.getServer())
        .post('/api/v1/user/onboarding')
        .set('Authorization', `Bearer ${token}`)
        .send(onboardingData);

      expect(onboardingResponse.status).toBe(200);
      expect(onboardingResponse.body.data.message).toBe('Onboarding completed successfully');

      // 4. Get onboarding status
      const getOnboardingResponse = await request(app.getServer()).get('/api/v1/user/onboarding').set('Authorization', `Bearer ${token}`);

      expect(getOnboardingResponse.status).toBe(200);
      expect(getOnboardingResponse.body.data.onboarding_completed).toBe(true);
      expect(getOnboardingResponse.body.data.onboarding_data.goal).toBe(GoalType.BOTH);
    });
  });
});
