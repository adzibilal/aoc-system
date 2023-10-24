'use client'
import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useData } from '@/components/providers/data-provider'
import axios from 'axios'
import { use, useEffect, useState } from 'react'
import { BahanBaku, Produk } from '@prisma/client'
import { set } from 'zod'
import { useRouter } from 'next/navigation'

const BahanBakuPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [mounted, setMounted] = useState(false)
    const [produk, setProduk] = useState<Produk[]>([
        {
            id: '',
            nama: '',
            deskripsi: '',
            harga: 0,
            cabangId: cabangId!,
            kategoriProdukId: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])

    const getProduk = async () => {
        if (cabangId) {
            const produk = await axios.get(`/api/cabang/${cabangId}/produk`)
            return setProduk(produk.data)
        }
    }

    useEffect(() => {
        setCabangId(detailCabang?.id || '')
    }, [detailCabang])

    useEffect(() => {
        if (cabangId) getProduk()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cabangId, router])

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Produk</h1>
            {produk && (
                <DataTable
                    onDataChange={getProduk}
                    columns={columns}
                    //@ts-ignore
                    data={produk}
                    cabangId={detailCabang?.id}
                />
            )}
        </div>
    )
}

export default BahanBakuPage
