import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <nav>
      <Link href="/" className="flex items-center gap-2 ">
        <Image src="/logo.svg" alt="logo" width={38} height={32} />{" "}
        <h2 className='text-primary-100'>NexView</h2>
          </Link>
          
    </nav>
  );
}

export default Nav