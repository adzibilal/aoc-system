import { useData } from '@/components/providers/data-provider'
import { Button } from '@/components/ui/button'
import { dateFormat } from '@/lib/utils'
import { Pesanan, Produk } from '@prisma/client'
import axios from 'axios'
import { tr } from 'date-fns/locale'
import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ListPesananProps {
    transaksiUnpay: Pesanan[]
    onSuccessBayar: () => void
}

const ListPesanan = ({ transaksiUnpay, onSuccessBayar }: ListPesananProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className=''>
            <div className='relative' onClick={() => setIsOpen(true)}>
                <Button variant='outline' className=''>
                    <ShoppingCart size={24} />
                </Button>
                <div className='absolute bg-red-700 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center top-[-5px] right-[-5px] text-xs'>
                    {transaksiUnpay.length}
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                        onClick={() => setIsOpen(false)}></div>
                    <div className='fixed z-50 bg-white py-5 px-5 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md max-md:w-[90%] md:min-w-[400px]'>
                        <h1 className='text-xl mb-3 font-semibold text-center'>
                            Pesanan Belum Dibayar
                        </h1>
                        {transaksiUnpay.length === 0 && (
                            <div className='text-center text-zinc-400 my-10'>
                                Tidak ada pesanan
                            </div>
                        )}
                        {transaksiUnpay.map((item, index) => (
                            <div
                                className='flex items-center justify-between gap-5 p-3 border border-zinc-300 my-2 rounded-md'
                                key={index}>
                                <div className=''>
                                    <div className=''>{item.namaPelanggan}</div>
                                    <div className='text-sm text-zinc-400'>
                                        {item.createdAt &&
                                            dateFormat(item.createdAt)}
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <Button variant='outline' className=''>
                                        Detail
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ListPesanan
