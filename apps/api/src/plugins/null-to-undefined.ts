import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

function nullToUndefined(obj: any): any {
  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(nullToUndefined);
  } else if (obj && typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : nullToUndefined(v)])
    );
  }
  return obj === null ? undefined : obj;
}
const nullToUndefinedPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preSerialization", async (_req, _reply, payload) => {
    return nullToUndefined(payload);
  });
};

export default fp(nullToUndefinedPlugin, {
  name: "fastify-null-to-undefined",
});
