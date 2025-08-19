import { FastifyInstance } from 'fastify';

import { setupDatabase } from '@/memory/database';

export default async function initDatabase({ log }: FastifyInstance) {
  log.info("Initializing database...");
  setupDatabase();
  log.info("Database initialized successfully");
}