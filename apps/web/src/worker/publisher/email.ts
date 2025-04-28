import { EmailPayload } from '@/lib/email';

import { emailQueue } from '../queue';

export const emailPublisher = (payload: EmailPayload) => {
  return emailQueue.add("email", payload);
}