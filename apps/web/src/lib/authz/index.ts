import { generateTokens, verifyToken } from "./jwt";
import { Provider } from "./providers/types";

export type AuthOptions = {
  providers: Provider[]
}
type Auth = {
  providers: Record<string, Provider>;
  jwt: {
    generateTokens: typeof generateTokens;
    verifyToken: typeof verifyToken;
  }
}

export function NewAuth(options: AuthOptions): Auth {
  return {
    providers: options.providers
      .map((provider) => ({ [provider.path]: provider }))
      .reduce((a, b) => ({ ...a, ...b }), {}),
    jwt: {
      generateTokens,
      verifyToken
    }
  }
}