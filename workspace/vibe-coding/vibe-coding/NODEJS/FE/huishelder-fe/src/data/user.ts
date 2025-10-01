import { UserDataInterface } from 'hooks/interfaces';

export const USER_DEFAULTS: UserDataInterface = {
  user: null,
  loading: false,
  error: null,
  login: async () => {
    throw new Error('Login not initialized');
  },
  logout: async () => {
    throw new Error('Logout not initialized');
  },
};

export const USER_MOCK = {
  id: '0611f9e7-b6a4-4cb8-9891-user',
  authenticated: true,
  profile: {
    id: '0611f9e7-b6a4-4cb8-9891-profile',
    username: 'kschaft001',
    first_name: 'Koen',
    last_name: 'Schaft',
    name: 'Koen Schaft',
    initials: 'KS',
    email: 'koen.schaft@pwc.com',
    los: 'Advisory',
    role: 'Manager',
  },
};
