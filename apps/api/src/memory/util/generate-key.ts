import crypto from 'crypto';

export function generateKey(tenantId: string, name: string, type: string): string {
  const canonical = `${tenantId}:${type}:${name}`.trim().toLowerCase();
  return crypto.createHash('sha1').update(canonical).digest('hex');
}