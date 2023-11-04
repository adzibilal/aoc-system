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
import { useEffect, useState } from 'react'
import { useCabangStore } from '@/store/selectedCabang'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const DashboardPage: NextPage = () => {
    const detailCabang = useCabangStore(state => state.cabang)
    const [recentSales, setRecentSales] = useState([])
    const [dashboardData, setDashboardData] = useState<any>({})

    const getDataDashboard = async () => {
        const res = await fetch(`/api/cabang/${detailCabang?.id}/dashboard`, {
            method: 'GET'
        })
        const data = await res.json()
        setDashboardData(data)
        setRecentSales(data.recentSales)
    }

    useEffect(() => {
        getDataDashboard()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useCabangStore.getState().cabang])
    return (
        <div className='p-6'>
            <div className='flex items-center justify-between my-5 max-sm:flex-col max-sm:items-start max-sm:gap-3'>
                <h1 className='text-2xl font-bold'>
                    Dashboard Cabang {detailCabang?.nama}
                </h1>
                <DatePickerWithRange />
            </div>
            <StatDashboard data={dashboardData} />

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
                            You made {dashboardData.total_transaction_thismonth}{' '}
                            transactions this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentSales data={recentSales} />
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-2 max-md:grid-cols-1 my-5'>
                <Card>
                    <CardHeader>
                        <CardTitle>Data Bahan Baku Habis</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {dashboardData?.dataBahanBakuHabis?.map(
                            (item: any, i: number) => (
                                <div
                                    key={i}
                                    className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <ExclamationTriangleIcon className='h-5 w-5 text-yellow-500' />
                                        <div className='text-sm text-muted-foreground'>
                                            {item.nama} - {item.kategori}
                                        </div>
                                    </div>
                                    <div className='text-sm text-muted-foreground'>
                                        {item.stok} {item.satuan}
                                    </div>
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage
