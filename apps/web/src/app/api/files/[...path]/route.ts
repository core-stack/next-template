import { redirect, RedirectType } from 'next/navigation';

import { getPreSignedDownloadUrl } from '@packages/storage';

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const filePath = path.join("/");
  const url = await getPreSignedDownloadUrl(filePath);
  return redirect(url, RedirectType.replace);
}