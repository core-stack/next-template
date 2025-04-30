import axios from 'axios';

import { prisma, User } from '@packages/prisma';

import { Provider } from './';

type Opts = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  REDIRECT_URI: string;
}
export const GoogleProvider = ({ GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI }: Opts) => {
  const path = "google";
  return {
    path,
    getAuthUrl: (): string => {
        const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        url.searchParams.set('client_id', GOOGLE_CLIENT_ID);
        url.searchParams.set('redirect_uri', REDIRECT_URI);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('scope', 'openid email profile');
        url.searchParams.set('prompt', 'consent');
        return url.toString();
    },
    callback: async (code: string): Promise<User> => {
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });
    
      const { access_token } = tokenRes.data;
    
      const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
    
      const profile = profileRes.data;
    
      const account = await prisma.account.upsert({
        where: { provider_providerAccountId: { provider: path, providerAccountId: profile.sub} },
        update: {},
        create: {
          provider: path,
          providerAccountId: profile.sub,
          user: {
            connectOrCreate: {
              where: { email: profile.email },
              create: {
                email: profile.email,
                name: profile.name,
                image: profile.picture,
              }
            }
          }
        },
        include: {
          user: true
        }
      });
    
      return account.user;
    }    
  } as Provider
}