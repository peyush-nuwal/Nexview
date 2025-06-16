

import Nav from '@/components/Nav';
import React, { ReactNode } from 'react'

const RootLayout = ({children}:{children:ReactNode}) => {
  return <div className='root-layout'>
     <Nav/>
    {children}</div>;
}

export default RootLayout