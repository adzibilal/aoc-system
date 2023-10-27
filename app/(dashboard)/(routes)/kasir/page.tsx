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
import { CheckCircle, ImageIcon, MinusCircle, PlusCircle } from 'lucide-react'
import ItemCart from './_components/item-cart'
import useKasirStore from '@/store/kasirPage'
import toast from 'react-hot-toast'
import useSessionStore from '@/store/sessions'
import { Input } from '@/components/ui/input'
import ListPesanan from './_components/list-pesanan'
import { Pesanan } from '@prisma/client'
import { get } from 'http'
import jsPDF from 'jspdf'

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
    const {
        cabangId,
        setCabangId,
        isChart,
        setIsChart,
        produk,
        setProduk,
        itemCart,
        setItemCart,
        updateCart,
        getProduk,
        incrementItemQty,
        decrementItemQty
    } = useKasirStore() // Access the store state and actions

    const router = useRouter()
    const { detailCabang, userData } = useData()
    const [transaksiUnpay, setTransaksiUnpay] = useState<Pesanan[]>([])

    const [namaPelanggan, setNamaPelanggan] = useState('')
    const [uangTunai, setUangTunai] = useState(0)
    const [confirmPay, setConfirmPay] = useState(false)
    const [kembalian, setKembalian] = useState(false)

    useEffect(() => {
        setCabangId(detailCabang?.id || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [detailCabang])

    useEffect(() => {
        if (cabangId) getProduk()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cabangId, router])

    const getTransaksiUnpay = async () => {
        if (!cabangId) return
        try {
            const trans = await axios.get(
                `/api/cabang/${cabangId}/transaksi/unpay`
            )
            setTransaksiUnpay(trans.data)
        } catch (error) {
            toast.error('Gagal mengambil data transaksi unpay')
        }
    }

    useEffect(() => {
        getTransaksiUnpay()
    }, [cabangId])

    const handleSimpanTransaksi = async () => {
        const cabangId = itemCart[0].item.cabangId
        const penggunaId = userData?.id
        const transaksi = { itemCart, cabangId, penggunaId, namaPelanggan }
        try {
            toast.loading('Menyimpan transaksi')
            await axios.post('/api/transaksi', {
                transaksi
            })
            toast.dismiss()
            toast.success('Berhasil menyimpan transaksi')
            router.refresh()

            clearCart()
        } catch (error) {
            toast.error('Gagal menyimpan transaksi')
        }
    }

    const handleBayar = async () => {
        if (
            uangTunai <
            itemCart.reduce((acc, item) => acc + item.item.harga * item.qty, 0)
        ) {
            toast.error('Uang tunai kurang')
            return
        }
        const cabangId = itemCart[0].item.cabangId
        const penggunaId = userData?.id
        const status = 'LUNAS'
        const transaksi = {
            itemCart,
            cabangId,
            penggunaId,
            namaPelanggan,
            status
        }
        try {
            toast.loading('Membayar transaksi')
            await axios.post('/api/transaksi', {
                transaksi
            })
            toast.dismiss()
            toast.success('Berhasil membayar transaksi')
            router.refresh()

            setConfirmPay(false)
            setKembalian(true)
        } catch (error: any) {
            toast.dismiss()
            toast.error('Gagal membayar transaksi')
            // Check if the error has a response message
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                const errorMessage = error.response.data.message
                toast.error(errorMessage)
            }
        }
    }

    const formatInputUang = (value: string) => {
        const val = value.replace(/\D/g, '')
        if (val === '') return setUangTunai(0)
        setUangTunai(parseInt(val))
    }

    const clearCart = () => {
        setItemCart([])
        getTransaksiUnpay()
        setNamaPelanggan('')
        setUangTunai(0)
        setConfirmPay(false)
    }

    const generateReceipt = () => {
        toast.success('Comming soon')
    }

    return (
        <div className='p-6 bg-zinc-50 kasir-page'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold mb-5'>Kasir Page</h1>
                <ListPesanan
                    onSuccessBayar={() => clearCart()}
                    transaksiUnpay={transaksiUnpay}
                />
            </div>

            <div className='grid grid-cols-[1fr_400px] gap-5 items-start'>
                {produk.length !== 0 ? (
                    <div className='grid grid-cols-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3'>
                        {produk.map(item => (
                            <ProdukCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className='text-center text-gray-400 h-32 flex items-center justify-center'>
                        Belum ada produk
                    </div>
                )}

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
                                    <Button
                                        size='icon'
                                        variant='outline'
                                        className='scale-75'
                                        onClick={() =>
                                            decrementItemQty(item.item.id)
                                        }>
                                        <MinusCircle />
                                    </Button>
                                    <div className='border w-[30px] h-[30px] rounded-sm flex items-center justify-center'>
                                        {item.qty}
                                    </div>
                                    <Button
                                        size='icon'
                                        variant='outline'
                                        className='scale-75'
                                        onClick={() =>
                                            incrementItemQty(item.item.id)
                                        }>
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

                        <div className='bg-zinc-100 rounded-md p-3 mb-3'>
                            {/* input nama pelanggan */}
                            <Input
                                placeholder='Nama Pelanggan'
                                value={namaPelanggan}
                                className='focus:!ring-0 focus:!outline-none'
                                onChange={e => setNamaPelanggan(e.target.value)}
                            />
                        </div>

                        <Button
                            className='w-full mb-2'
                            variant='secondary'
                            onClick={handleSimpanTransaksi}>
                            Simpan Transaksi
                        </Button>
                        <Button
                            className='w-full'
                            variant='default'
                            onClick={() => setConfirmPay(true)}>
                            Bayar
                        </Button>
                    </div>
                </div>
            </div>

            {confirmPay && (
                <>
                    <div
                        className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                        onClick={() => setConfirmPay(false)}></div>
                    <div className='fixed z-50 bg-white py-5 px-5 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md max-md:w-[90%] md:min-w-[400px]'>
                        <h1 className='text-xl mb-5 font-semibold text-center'>
                            Konfirmasi Pesanan
                        </h1>
                        {itemCart.map((item, index) => (
                            <div
                                className='flex items-center justify-between gap-5 p-3 border border-zinc-300 my-2 rounded-md'
                                key={index}>
                                <div className=''>
                                    <div className=''>{item.item.nama}</div>
                                    <div className='text-sm text-zinc-400'>
                                        {item.qty} x{' '}
                                        {rupiahFormat(item.item.harga)}
                                    </div>
                                </div>
                                <div className='font-semibold text-green-600'>
                                    {rupiahFormat(item.item.harga * item.qty)}
                                </div>
                            </div>
                        ))}

                        <div className='flex justify-between items-center mb-3 mt-5'>
                            <div className='text-lg font-semibold'>Total</div>
                            <div className='text-xl font-semibold text-green-600'>
                                {rupiahFormat(
                                    itemCart.reduce(
                                        (acc, item) =>
                                            acc + item.item.harga * item.qty,
                                        0
                                    )
                                )}
                            </div>
                        </div>

                        <div className='p-2 rounded-md bg-zinc-100 mb-3'>
                            <Input
                                placeholder='Nama Pelanggan'
                                value={namaPelanggan}
                                className='focus:!ring-0 focus:!outline-none mb-2'
                                onChange={e => setNamaPelanggan(e.target.value)}
                            />
                            <Input
                                placeholder='Masukan Uang Pembayaran'
                                value={uangTunai}
                                onChange={e => formatInputUang(e.target.value)}
                                className='focus:!ring-0 focus:!outline-none'
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-3'>
                            <Button
                                className='w-full'
                                variant='outline'
                                onClick={() => setConfirmPay(false)}>
                                Batal
                            </Button>
                            <Button
                                className='w-full'
                                variant='default'
                                onClick={handleBayar}>
                                Bayar
                            </Button>
                        </div>
                    </div>
                </>
            )}

            {kembalian && (
                <>
                    <div
                        className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                        onClick={() => {
                            setKembalian(false)
                            clearCart()
                        }}></div>
                    <div className='fixed z-50 bg-white py-5 px-5 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md max-md:w-[90%] md:min-w-[400px]'>
                        <h1 className='text-xl mb-5 font-semibold text-center'>
                            Pembayaran Berhasil
                        </h1>
                        <CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-5' />

                        <p className='text-center mb-1'>Jumlah Kembalian</p>
                        <p className='text-xl font-semibold text-green-600 text-center mb-5'>
                            {rupiahFormat(
                                uangTunai -
                                    itemCart.reduce(
                                        (acc, item) =>
                                            acc + item.item.harga * item.qty,
                                        0
                                    )
                            )}
                        </p>

                        <Button
                            className='w-full mb-2'
                            variant='secondary'
                            onClick={() => generateReceipt()}>
                            Cetak Struk
                        </Button>
                        <Button
                            className='w-full'
                            variant='default'
                            onClick={() => {
                                setKembalian(false)
                                clearCart()
                            }}>
                            Selesai
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default KasirPage
