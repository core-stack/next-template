
import { Provider } from "./providers/types";
import { Session } from "./session";
import { Store } from "./store/types";

export const AUTH_PROVIDERS = "AUTH_PROVIDERS";
export const AUTH_STORE = "AUTH_STORE";

export interface AuthModuleOptions {
  providers: Record<string, Provider>;
  store: Store<Session>;
}
