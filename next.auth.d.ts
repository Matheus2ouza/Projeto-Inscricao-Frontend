import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string;
      username: string;
      role: string;
      regionId?: string;
    };
    authToken?: string;
    refreshToken?: string;
    error?: 'RefreshAccessTokenError';
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    role: string;
    regionId?: string;
    authToken: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
    regionId?: string;
    authToken?: string;
    refreshToken?: string;
    error?: 'RefreshAccessTokenError';
  }
}
