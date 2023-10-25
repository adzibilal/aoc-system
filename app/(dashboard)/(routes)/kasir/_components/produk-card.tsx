'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { rupiahFormat } from '@/lib/utils'
import { ImageIcon, MinusCircle, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ProdukCardProps {
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
    onUpdateCart: (itemWithQty: { item: any, qty: number }) => void
}

const ProdukCard: React.FC<ProdukCardProps> = ({ item, onUpdateCart }) => {
    const [qty, setQty] = useState(0)

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
        <Card className='w-full p-3'>
            <div key={item.id}>
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
                    <h1 className='text-xl font-bold'>{item.nama}</h1>
                    <h1 className='text-xl font-bold text-green-600 my-1'>
                        {rupiahFormat(item.harga)}
                    </h1>
                </div>
                <div className='grid grid-cols-3 gap-2 mt-2'>
                    <Button
                        className=''
                        variant='outline'
                        onClick={handleMinusClick}>
                        <MinusCircle />
                    </Button>
                    <div className="qty w-full border border-zinc-300 rounded-md font-semibold flex items-center justify-center">
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
        </Card>
    )
}

export default ProdukCard
