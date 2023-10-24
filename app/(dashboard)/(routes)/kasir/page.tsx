'use client'
import { useData } from '@/components/providers/data-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Produk } from '@prisma/client'
import axios from 'axios'
import { ImageIcon, MinusCircle, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProdukKasirProps {
    id: string
    nama: string
    deskripsi: string | null
    harga: number
    image: string | null
    cabangId: string
    kategoriProdukId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kategori: {
        id: string
        nama: string
        createdAt: Date | null
        updatedAt: Date | null
    } | null
}

const KasirPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [mounted, setMounted] = useState(false)
    const [produk, setProduk] = useState<ProdukKasirProps[]>([
        {
            id: '',
            nama: '',
            deskripsi: '',
            harga: 0,
            image: '',
            cabangId: cabangId!,
            kategoriProdukId: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            kategori: {
                id: '',
                nama: '',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }
    ])

    const getProduk = async () => {
        if (cabangId) {
            const produk = await axios.get(`/api/kasir/${cabangId}/produk`)
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
            <h1 className='text-2xl font-bold mb-5'>Kasir Page</h1>

            {produk && (
                <div className='grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3'>
                    {produk.map(item => (
                        <div
                            key={item.id}
                            className='border rounded-md w-full p-3'>
                            {!item.image ? (
                                <div className='flex items-center justify-center h-auto w-full mb-3 max-md:w-full max-md:h-auto bg-zinc-200 rounded-md aspect-video'>
                                    <ImageIcon className='h-10 w-10 text-zinc-500' />
                                </div>
                            ) : (
                                <div className='relative aspect-video  h-auto mb-3 max-md:h-auto'>
                                    <Image
                                        alt='Upload'
                                        fill
                                        className='object-cover rounded-md'
                                        src={item.image}
                                    />
                                </div>
                            )}
                            <Badge className='mb-2' variant='outline'>
                                {item.kategori?.nama}
                            </Badge>
                            <div className='flex flex-col justify-between'>
                                <h1 className='text-xl font-bold'>
                                    {item.nama}
                                </h1>
                                <h1 className='text-xl font-bold text-green-600 my-1'>
                                    Rp. {item.harga}
                                </h1>
                            </div>
                            <p className='text-sm'>{item.deskripsi}</p>
                            <div className='grid grid-cols-3 gap-2 mt-2'>
                                <Button className='' variant='outline'>
                                    <MinusCircle />
                                </Button>
                                <input
                                    type='number'
                                    className='w-full text-center'
                                    value={0}
                                />
                                <Button className='' variant='outline'>
                                    <PlusCircle />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default KasirPage
