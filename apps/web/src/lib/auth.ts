import { env } from "@/env";

import { NewAuth } from "./authz";
import { GoogleProvider } from "./authz/providers/google";

export const auth = NewAuth({
  providers: [
    GoogleProvider({
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI: env.GOOGLE_REDIRECT_URL
    })
  ]
})