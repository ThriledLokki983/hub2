// Manual mock for pg database using in-memory store
import { QueryResult } from 'pg';

// Pre-populate with a test user for ID=1 tests
interface User {
  id: number;
  email: string;
  password: string;
}

// In-memory database
const users: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    password: '$2b$10$TBEfaCe1oo.2jfkBDWcj/usBj4oECsW2wOoDXpCc1shPuLEbqGIOi',
  },
];

let nextId = 2;

export const client = {
  query: jest.fn().mockImplementation((query: string, params: any[] = []): Promise<QueryResult<any>> => {
    // Normalize query by removing extra whitespace for easier matching
    const q = query.toLowerCase().replace(/\s+/g, ' ').trim();

    // SELECT all users
    if (q.includes('select * from users') && !q.includes('where')) {
      return Promise.resolve({
        rows: [...users],
        rowCount: users.length,
      });
    }

    // SELECT user by ID
    if (q.includes('select * from users where id =')) {
      const userId = params[0];
      const user = users.find(u => u.id === userId);

      if (user) {
        return Promise.resolve({
          rows: [user],
          rowCount: 1,
        });
      }
      return Promise.resolve({ rows: [], rowCount: 0 });
    }

    // SELECT user by email
    if (q.includes('select * from users where email =') || q.includes('select * from users where "email" =')) {
      const email = params[0];
      const user = users.find(u => u.email === email);

      if (user) {
        return Promise.resolve({
          rows: [user],
          rowCount: 1,
        });
      }
      return Promise.resolve({ rows: [], rowCount: 0 });
    }

    // EXISTS check for user by ID
    if ((q.includes('select exists') && q.includes('where id =')) || (q.includes('select exists') && q.includes('where "id" ='))) {
      const userId = params[0];
      const exists = users.some(u => u.id === userId);
      return Promise.resolve({
        rows: [{ exists }],
        rowCount: 1,
      });
    }

    // EXISTS check for email
    if ((q.includes('select exists') && q.includes('where email =')) || (q.includes('select exists') && q.includes('where "email" ='))) {
      const email = params[0];
      const exists = users.some(u => u.email === email);
      return Promise.resolve({
        rows: [{ exists }],
        rowCount: 1,
      });
    }

    // INSERT new user
    if (q.includes('insert into users') || q.includes('insert into users(')) {
      const email = params[0];
      const password = params[1];

      // Check if email is unique
      if (users.some(u => u.email === email)) {
        return Promise.resolve({
          rows: [],
          rowCount: 0,
          error: new Error(`This email ${email} already exists`),
        });
      }

      const newUser = {
        id: nextId++,
        email,
        password,
      };

      users.push(newUser);

      return Promise.resolve({
        rows: [newUser],
        rowCount: 1,
      });
    }

    // UPDATE user
    if (q.includes('update users set')) {
      const userId = params[0];
      const email = params[1];
      const password = params[2];

      const index = users.findIndex(u => u.id === userId);

      if (index === -1) {
        return Promise.resolve({
          rows: [],
          rowCount: 0,
        });
      }

      users[index] = {
        ...users[index],
        email,
        password,
      };

      return Promise.resolve({
        rows: [users[index]],
        rowCount: 1,
      });
    }

    // DELETE user
    if (q.includes('delete from users where id =')) {
      const userId = params[0];
      const index = users.findIndex(u => u.id === userId);

      if (index === -1) {
        return Promise.resolve({
          rows: [],
          rowCount: 0,
        });
      }

      const deleted = users.splice(index, 1)[0];

      return Promise.resolve({
        rows: [deleted],
        rowCount: 1,
      });
    }

    // Default response for unmatched queries
    return Promise.resolve({
      rows: [],
      rowCount: 0,
    });
  }),
  connect: jest.fn(),
  end: jest.fn(),
};

export default client;
