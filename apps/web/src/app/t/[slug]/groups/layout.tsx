
import React from 'react';

import { Topbar } from './components/topbar';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { slug } = await params;
  return (
    <>
      <Topbar slug={slug} />
      <div className='p-6'>
        {children}
      </div>
    </>
  )
}
