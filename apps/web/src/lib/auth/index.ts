import { User } from '@packages/prisma';

export interface Provider {
  path: string;
  getAuthUrl(): string | Promise<string>
  callback(code: string): User | Promise<User>
}

export type AuthOptions = {
  providers: Provider[]
}

export function Auth(opts: AuthOptions) {

}