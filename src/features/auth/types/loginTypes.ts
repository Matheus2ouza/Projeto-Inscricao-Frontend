export type Region = {
  id: string;
  Name: string;
};

export type UserRole = 'SUPER' | 'ADMIN' | 'MANAGER' | 'USER';

export type User = {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  region?: Region;
  image?: string;
};

export type LoginServiceInput = {
  username: string;
  password: string;
};

export type RequestData = {
  username: string;
  password: string;
};

export type LoginServiceOutput = {
  role: string;
};

export type SessionData = {
  user: User;
};

export type AuthResponse = {
  authToken: string;
  refreshToken: string;
  user: User;
};

export type LoginUserResponse = {
  authToken: string;
  refreshToken: string;
  user: User;
};

export type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
};
