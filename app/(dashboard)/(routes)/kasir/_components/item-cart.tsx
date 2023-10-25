'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { rupiahFormat } from '@/lib/utils'
import { ImageIcon, MinusCircle, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ItemCartProps {
    item: {
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
    qtyCart: number
    onUpdateCart: (itemWithQty: { item: any; qty: number }) => void
}

const ItemCart: React.FC<ItemCartProps> = ({ item, qtyCart, onUpdateCart }) => {
    const [qty, setQty] = useState(qtyCart)

    const handleMinusClick = () => {
        if (qty > 0) {
            setQty(qty - 1)
            onUpdateCart({ item, qty: qty - 1 })
        }
    }

    const handlePlusClick = () => {
        setQty(qty + 1)
        onUpdateCart({ item, qty: qty + 1 })
    }

    return (
        <div className='flex justify-between items-center gap-3' key={item.id}>
            {item.image ? (
                <Image
                    src={item.image || ''}
                    alt={item.nama}
                    width={100}
                    height={100}
                    className='w-[50px] h-[50px] object-cover rounded-md bg-center'
                />
            ) : (
                <div className='min-w-[50px] h-[50px] bg-zinc-200 rounded-md flex items-center justify-center'>
                    <ImageIcon className='h-7 w-7 text-zinc-500' />
                </div>
            )}
            <div className='w-full my-2'>
                <h1 className='font-semibold mb-1'>{item.nama}</h1>
                <div className='flex justify-between'>
                    <div className='price font-semibold text-green-600'>
                        {rupiahFormat(item.harga)}
                    </div>
                    <div>
                        <div className='grid grid-cols-3 gap-2 mt-2'>
                            <Button
                                className=''
                                variant='outline'
                                onClick={handleMinusClick}>
                                <MinusCircle />
                            </Button>
                            <div className='qty w-full border border-zinc-300 rounded-md font-semibold flex items-center justify-center'>
                                {qty}
                            </div>
                            <Button
                                className=''
                                variant='outline'
                                onClick={handlePlusClick}>
                                <PlusCircle />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCart
