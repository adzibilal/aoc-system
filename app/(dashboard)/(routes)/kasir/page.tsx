'use client'
import { useData } from '@/components/providers/data-provider'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProdukCard from './_components/produk-card'
import { is } from 'date-fns/locale'
import { set } from 'date-fns'
import { cn, rupiahFormat } from '@/lib/utils'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ImageIcon, MinusCircle, PlusCircle } from 'lucide-react'
import ItemCart from './_components/item-cart'

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

interface itemCart {
    item: ProdukKasirProps
    qty: number
}

const KasirPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [isChart, setIsChart] = useState(false)
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
    const [itemCart, setItemCart] = useState<itemCart[]>([])

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

    const updateCart = (itemWithQty: itemCart) => {
        console.error(itemWithQty)
        setIsChart(true)
        const newCart = [...itemCart]
        const existingItem = newCart.find(
            item => item.item.id === itemWithQty.item.id
        )
        if (existingItem) {
            existingItem.qty = itemWithQty.qty
            if (existingItem.qty === 0) {
                const index = newCart.indexOf(existingItem)
                newCart.splice(index, 1)
            }
        } else {
            newCart.push(itemWithQty)
        }
        setItemCart(newCart)
    }

    return (
        <div className='p-6 bg-zinc-50 kasir-page'>
            <h1 className='text-2xl font-bold mb-5'>Kasir Page</h1>

            <div
                className={cn('grid grid-cols-[1fr] gap-5 items-start', {
                    'grid-cols-[1fr_400px]': isChart
                })}>
                {produk && (
                    <div className='grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3'>
                        {produk.map(item => (
                            <ProdukCard
                                key={item.id}
                                item={item}
                                onUpdateCart={updateCart}
                            />
                        ))}
                    </div>
                )}
                {isChart && (
                    <div className='cart bg-white shadow-md rounded-md p-3 sticky top-[90px] transition'>
                        <h1 className='text-lg font-bold mb-1'>Pesanan</h1>
                        {itemCart.map(item => (
                            <div
                                className='flex justify-between items-center gap-3'
                                key={item.item.id}>
                                {item.item.image ? (
                                    <Image
                                        src={item.item.image || ''}
                                        alt={item.item.nama}
                                        width={100}
                                        height={100}
                                        className='w-[50px] h-[50px] object-cover rounded-md bg-center'
                                    />
                                ) : (
                                    <div className='min-w-[50px] h-[50px] bg-zinc-200 rounded-md flex items-center justify-center'>
                                        <ImageIcon className='h-7 w-7 text-zinc-500' />
                                    </div>
                                )}
                                <div className='w-full my-2 flex justify-between items-center'>
                                    <div className=''>
                                        <h1 className='font-semibold mb-1'>
                                            {item.item.nama}
                                        </h1>
                                        <div className='price font-semibold text-green-600'>
                                            {rupiahFormat(item.item.harga)}
                                        </div>
                                    </div>
                                    {/* fungsi tambah kurang item cart */}
                                    <div className='flex items-center gap-1'>
                                        <Button size='icon' variant='outline' className='scale-75'>
                                            <MinusCircle />
                                        </Button>
                                        <div className='border w-[30px] h-[30px] rounded-sm flex items-center justify-center'>{item.qty}</div>
                                        <Button size='icon' variant='outline' className='scale-75'>
                                            <PlusCircle />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {itemCart.length === 0 && (
                            <div className='text-center text-gray-400 h-32 flex items-center justify-center'>
                                Belum ada pesanan
                            </div>
                        )}
                        <div className='mt-2'>
                            <div className='sub-total bg-zinc-100 rounded-md p-3 mb-3'>
                                <div className='total flex justify-between items-center'>
                                    <div className=''>Total</div>
                                    <div className='text-xl font-semibold text-green-600'>
                                        {rupiahFormat(
                                            itemCart.reduce(
                                                (acc, item) =>
                                                    acc +
                                                    item.item.harga * item.qty,
                                                0
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button className='w-full' variant='default'>
                                Bayar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default KasirPage
