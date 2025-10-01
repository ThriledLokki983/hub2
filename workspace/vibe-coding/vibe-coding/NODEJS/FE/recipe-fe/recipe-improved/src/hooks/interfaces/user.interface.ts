import React from 'react';

interface UserInterface {
  id: string | number
  authenticated: boolean
  profile: {
    id: string | number
    username: string
    first_name: string
    last_name: string
    name: string
    initials: string
    email: string
    los: string
    role: string
  }
}

interface UserDataInterface {
  user: UserInterface;
  login: () => void;
  logout: () => void;
}

type ContextProps = {
  children: React.ReactNode;
};

export type {
  ContextProps,
  UserInterface,
  UserDataInterface,
}
