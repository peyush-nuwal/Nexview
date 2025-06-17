

import Nav from '@/components/Nav';
import React, { ReactNode } from 'react'
import { isAuthenticated } from '../../../lib/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async({ children }: { children: ReactNode }) => {
  
  const isUserAuthenticated = await isAuthenticated(); 

  if (!isUserAuthenticated) redirect('/sign-in')
  return <div className='root-layout'>
     <Nav/>
    {children}</div>;
}

export default RootLayout