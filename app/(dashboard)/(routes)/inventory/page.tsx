'use client'
import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useData } from '@/components/providers/data-provider'
import axios from 'axios'
import { use, useEffect, useState } from 'react'
import { Inventory } from '@prisma/client'
import { set } from 'zod'
import { useRouter } from 'next/navigation'

const InventoryPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [mounted, setMounted] = useState(false)
    const [inventory, setInventory] = useState<Inventory[]>([
        {
            id: '',
            name: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            cabangId: '',  
        }
    ])

    const getInventory = async () => {
        if (cabangId) {
            const bahan = await axios.get(`/api/cabang/${cabangId}/inventory`)
            return setInventory(bahan.data)
        }
    }

    useEffect(() => {
        setCabangId(detailCabang?.id || '')
    }, [detailCabang])

    useEffect(() => {
        if (cabangId) getInventory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cabangId, router])

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Inventory Cabang</h1>
            {inventory && (
                <DataTable
                    onDataChange={getInventory}
                    columns={columns}
                    data={inventory}
                    cabangId={detailCabang?.id}
                />
            )}
        </div>
    )
}

export default InventoryPage
