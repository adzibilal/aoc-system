'use client'
import { useData } from '@/components/providers/data-provider'
import { NextPage } from 'next'

interface UserData {
    id: string
    username: string
    password: string
    role: string
    nama: string
    cabangId: string
}

interface SessionData {
    user: UserData
    expDateTime: string
}

const DashboardPage: NextPage = () => {
    const { detailCabang } = useData()

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Dashboard Cabang {detailCabang?.nama}</h1>
        </div>
    )
}

export default DashboardPage
