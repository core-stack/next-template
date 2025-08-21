import React from 'react';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  return (
      <div className='p-6'>
        {children}
      </div>
  )
}
