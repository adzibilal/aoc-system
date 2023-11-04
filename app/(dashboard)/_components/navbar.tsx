'use client'
import { Button } from '@/components/ui/button'
import { SessionData } from '@/types'
import React from 'react'
import toast from 'react-hot-toast'
import { MobileSidebar } from './mobile-sidebar'
import { useData } from '@/components/providers/data-provider'
import SelectCabang from './select-cabang'

const Navbar = () => {
    const { userData } = useData()


    return (
        <nav className='h-full text-white p-3 flex items-center justify-between px-6'>
            <div className='flex items-center gap-3'>
                <MobileSidebar />
                <div className='max-sm:hidden'>Hello {userData?.nama}</div>
            </div>
            <div className="flex items-center gap-2">
            <SelectCabang />
            <Button
                variant='secondary'
                onClick={() => {
                    localStorage.removeItem('session')
                    toast.success('Logout Berhasil')
                    window.location.href = '/sign-in'
                }}>
                Logout
            </Button>
            </div>
        </nav>
    )
}

export default Navbar
