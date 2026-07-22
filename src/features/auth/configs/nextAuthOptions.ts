import {
  loginService,
  LoginServiceInput,
  userDataService,
} from '@/features/auth/services';
import { refreshAccessTokenWithLock } from '@/lib/auth';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const loginServiceInput: LoginServiceInput = {
          username: credentials?.username || '',
          password: credentials?.password || '',
        };

        const result = await loginService(loginServiceInput);
        const user = await userDataService({
          authToken: result.authToken,
        });

        const authorizeUser: User = {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email,
          regionId: user.regionId,
          authToken: result.authToken,
          refreshToken: result.refreshToken,
        };

        return authorizeUser;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.email = user.email;
        token.regionId = user.regionId;
        token.authToken = user.authToken;
        token.refreshToken = user.refreshToken;
      }

      if (!token.authToken) {
        return token;
      }

      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      let exp: number;

      try {
        ({ exp } = jwtDecode<{ exp: number }>(token.authToken));
      } catch (error) {
        console.error('Error decoding authToken', error);

        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }

      if (Date.now() < exp * 1000) {
        return token;
      }

      if (!token.refreshToken) {
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }

      return refreshAccessTokenWithLock(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.regionId = token.regionId;
      }
      session.authToken = token.authToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      return session;
    },
  },
};

const handle = NextAuth(nextAuthOptions);

export { handle as GET, handle as POST };
