import { db } from '@/lib/db'
import { useEffect } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ProdukForm } from './_components/produk-form'

const ProdukIdPage = async ({ params }: { params: { produkId: string } }) => {
    const produk = await db.produk.findUnique({
        where: {
            id: params.produkId
        },
        include: {
            kategori: true
        }
    })

    const resep = await db.resep.findMany({
        where: {
            produkId: params.produkId
        },
        include: {
            BahanBaku: true
        }
    })

    const formattedResep = resep.map(item => ({
        id: item.id,
        nama: item.BahanBaku.nama,
        jumlah: item.jumlah,
        satuan: item.BahanBaku.satuan
    }))

    return (
        <div className='p-6'>
            <Link href='/produk'>
                <Button className='mb-4' variant='outline'>
                    <ArrowLeftIcon className='mr-3' />
                    Kembali
                </Button>
            </Link>
            <ProdukForm
                initialData={{
                    nama: produk?.nama || '',
                    deskripsi: produk?.deskripsi || '',
                    harga: produk?.harga || 0,
                    kategoriProdukId: produk?.kategori?.id || ''
                }}
                produkId={produk?.id}
                kategori={produk?.kategori?.nama}
            />
            <DataTable
                produkId={produk?.id}
                columns={columns}
                data={formattedResep}
            />
        </div>
    )
}

export default ProdukIdPage
