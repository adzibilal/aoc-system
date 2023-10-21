'use client'
import { Button } from '@/components/ui/button'
import { SessionData } from '@/types'
import React from 'react'
import toast from 'react-hot-toast'
import { MobileSidebar } from './mobile-sidebar'

const Navbar = () => {
    const session: string | null = localStorage.getItem('session')
    const { user }: SessionData = JSON.parse(session || '{}')
    if (!user) {
        window.location.href = '/sign-in'
    }

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
