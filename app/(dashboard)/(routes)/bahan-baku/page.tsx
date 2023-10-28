'use client'
import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useData } from '@/components/providers/data-provider'
import axios from 'axios'
import { use, useEffect, useState } from 'react'
import { BahanBaku } from '@prisma/client'
import { set } from 'zod'
import { useRouter } from 'next/navigation'

const BahanBakuPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [mounted, setMounted] = useState(false)
    const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([])

    const getBahanBaku = async () => {
        if (cabangId) {
            const bahan = await axios.get(`/api/cabang/${cabangId}/bahan-baku`)
            return setBahanBaku(bahan.data)
        }
    }

    useEffect(() => {
        setCabangId(detailCabang?.id || '')
    }, [detailCabang])

    useEffect(() => {
        if (cabangId) getBahanBaku()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cabangId, router])

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Bahan Baku</h1>
            {bahanBaku && (
                <DataTable
                    onDataChange={getBahanBaku}
                    columns={columns}
                    data={bahanBaku}
                    cabangId={detailCabang?.id}
                />
            )}
        </div>
    )
}

export default BahanBakuPage
