import { db } from '@/lib/db'
import { useEffect } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { ProdukForm } from './_components/produk-form'
import { ImageForm } from './_components/image-form'

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
            <div className='flex gap-5 items-start justify-between w-full max-xl:flex-col'>
                <ImageForm image={produk?.image!} produkId={produk?.id!} />
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
            </div>
            <h1 className='text-xl mt-5 font-bold'>Resep Produk</h1>
            <DataTable
                cabangId={produk?.cabangId}
                produkId={produk?.id}
                columns={columns}
                data={formattedResep}
            />
        </div>
    )
}

export default ProdukIdPage
