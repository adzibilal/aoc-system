'use client'
import { Button } from '@/components/ui/button'
import { SessionData } from '@/types'
import React from 'react'
import toast from 'react-hot-toast'
import { MobileSidebar } from './mobile-sidebar'
import { useData } from '@/components/providers/data-provider'

const Navbar = () => {
    const { user } = useData()


    return (
        <nav className='h-full text-white p-3 flex items-center justify-between px-6'>
            <div className='flex items-center gap-3'>
                <MobileSidebar />
                <div className=''>Hello {user.nama}</div>
            </div>
            <Button
                variant='secondary'
                onClick={() => {
                    localStorage.removeItem('session')
                    toast.success('Logout Berhasil')
                    window.location.href = '/sign-in'
                }}>
                Logout
            </Button>
        </nav>
    )
}

export default Navbar
