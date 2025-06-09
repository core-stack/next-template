import FastGlob from 'fast-glob';
import fp from 'fastify-plugin';
import path from 'path';

type Options = {
  baseDir?: string
};
export default fp(async (
  app,
  { baseDir = path.resolve("src/bootstrap") }: Options
) => {
  const logger = app.log.child({ plugin: 'BOOTSTRAP' });
  logger.info("Registering bootstrap plugin");
  const files = await FastGlob("*.ts", { cwd: baseDir, absolute: true });
  if (files.length === 0) {
    logger.warn("No bootstrap found");
    return;
  }
  for (const file of files) {
    const parsed = path.parse(file);
    const mod = await import(file);

    if (!mod.default) {
      logger.error(`Bootstrap ${parsed.name} has no default export`);
      continue;
    }

    const job = mod.default;

    if (typeof job !== "function") {
      logger.error(`Bootstrap ${parsed.name} is not a valid function`);
      continue;
    }

    try {
      await job({ ...app, log: logger });
      logger.info(`Bootstrap ${parsed.name} run successfully`);
    } catch (error) {
      logger.error(`Failed to run bootstrap ${parsed.name}: ${error}`);
    }
  }
});
