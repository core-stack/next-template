import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const heads = await headers()
  const locale = heads.get("locale") ?? "en"
  
  return {
    locale,
    messages: (await import(`../../../../locales/${locale}.json`)).default
  };
});