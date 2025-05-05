import { env } from '@/env';

import { Authz } from './authz';
import { GoogleProvider } from './authz/providers/google';

export const auth = new Authz({
  providers: [
    GoogleProvider({
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI: env.GOOGLE_REDIRECT_URL
    }),
  ],
  sessionStore: env.SESSION_STORE,
})
