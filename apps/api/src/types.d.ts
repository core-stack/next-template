import 'fastify';

import { Session } from './plugins/auth/session';

declare module "fastify" {
  interface FastifyRequest {
    session: Session;
  }
}
