import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
    return (
        <div className='p-3 text-white'>
            <Image src="/logo-white.png" alt="Logo" width={150} height={100} className='max-md:invert'/>
            <ul className='mt-5 max-md:text-zinc-950'>
                <Link href="/cabang"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Cabang</li></Link>
                <Link href="#"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Pegawai</li></Link>
                <Link href="#"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Produk</li></Link>
                <Link href="#"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Resep</li></Link>
                <Link href="#"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Kasir</li></Link>
                <Link href="#"><li className='p-2 rounded-md hover:bg-zinc-800 px-3 hover:text-white'>Bahan Baku</li></Link>
            </ul>
        </div>
    );
};

export default Sidebar;
