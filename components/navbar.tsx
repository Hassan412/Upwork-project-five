import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <nav className='w-full px-4 p-8'>
        <div className='flex justify-between items-center'>
        <div className='flex gap-2 justify-center items-center'>
    <Image alt='Logo' src={"/Images/logo.png"} width={25} height={25}/>
    <span className='font-bold'>Streamkick</span>
</div>
            <div className='px-6 py-2 bg-[#6151EE] rounded-full'>
              Dashboard
            </div>
        </div>
    </nav>
  )
}

export default Navbar