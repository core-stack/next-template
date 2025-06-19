import fp from 'fastify-plugin';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { LanguageDetector } from 'i18next-http-middleware';
import path from 'path';

export default fp(async (fastify) => {
  await i18next
    .use(Backend)
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
      preload: ['en', 'pt'],
      backend: {
        loadPath: path.join(__dirname, '../../../../locales/{{lng}}.json'),
      },
    });

  fastify.addHook('onRequest', async (req) => {
    const lng = req.headers['locale'] || 'en';
    req.t = i18next.getFixedT(lng);
  });
});
