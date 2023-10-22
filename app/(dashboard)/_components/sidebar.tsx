import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { SidebarRoutes } from './sidebar-routes';

const Sidebar = () => {
    return (
        <div className='p-3 text-white'>
            <Image src="/logo-white.png" alt="Logo" width={150} height={100} className='max-md:invert mb-5'/>
            <SidebarRoutes />
        </div>
    );
};

export default Sidebar;
