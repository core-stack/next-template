import FastGlob from 'fast-glob';
import fp from 'fastify-plugin';
import cron from 'node-cron';
import path from 'path';

import { cronJobOptionsSchema } from './types';

export default fp(async (app) => {
  const logger = app.log.child({ plugin: 'CRON' });
  const isProd = process.env.NODE_ENV === 'production';
  const baseDir = path.resolve(isProd ? 'dist/cron' : 'src/cron');
  const ext = isProd ? '*.js' : '*.ts';
  
  const files = await FastGlob(ext, { cwd: baseDir, absolute: true });
  if (files.length === 0) {
    logger.warn("No cron jobs found");
    return;
  }
  for (const file of files) {
    const parsed = path.parse(file);
    const { default: job, options = {} } = await import(file);
    
    if (typeof job !== "function") {
      logger.error(`Cron job ${parsed.name} is not a valid function`);
      continue;
    }
    if (cronJobOptionsSchema.safeParse(options).success === false) {
      logger.error(`Cron job ${parsed.name} has invalid options: ${JSON.stringify(options)}`);
      continue;
    }
    const parsedOptions = cronJobOptionsSchema.parse(options);

    if (parsedOptions.ignore) {
      logger.warn(`Cron job ${parsed.name} is ignored`);
      continue;
    }
    try {
      cron.schedule(parsedOptions.schedule, job.bind(null, app), { ...parsedOptions });
      logger.info(`Cron job ${parsed.name} (${parsedOptions.schedule}) registered successfully`);
    } catch (error) {
      logger.error(`Failed to register cron job ${parsed.name}: ${error}`);
    }
  }
});
