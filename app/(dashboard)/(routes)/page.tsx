'use client'
import { useData } from '@/components/providers/data-provider'
import { NextPage } from 'next'
import StatDashboard from '../_components/stat-dashboard'
import { DatePickerWithRange } from '../_components/date-range-picker'

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

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Overview } from '../_components/overview'
import { RecentSales } from '../_components/recent-sales'

const DashboardPage: NextPage = () => {
    const { detailCabang } = useData()

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between my-5'>
                <h1 className='text-2xl font-bold'>
                    Dashboard Cabang {detailCabang?.nama}
                </h1>
                <DatePickerWithRange />
            </div>
            <StatDashboard />

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-5'>
                <Card className='col-span-4'>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <Overview />
                    </CardContent>
                </Card>
                <Card className='col-span-3'>
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                            You made 265 sales this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
