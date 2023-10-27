import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        if (!values.transaksi.itemCart) {
            return new NextResponse('itemCart is missing in the payload', {
                status: 400
            })
        }

        const transaksi = await db.pesanan.create({
            data: {
                tanggal: new Date(),
                namaPelanggan: values.transaksi.namaPelanggan ?? '-',
                nomorMeja: values.transaksi.noMeja ?? null,
                cabangId: values.transaksi.cabangId,
                penggunaId: values.transaksi.penggunaId,
                status: values.transaksi.status ?? 'BELUM DIBAYAR',
                DetailPesanan: {
                    create: values.transaksi.itemCart.map((item: any) => ({
                        jumlah: item.qty,
                        produkId: item.item.id,
                        hargaSatuan: item.item.harga,
                        subtotal: item.item.harga * item.qty
                    }))
                }
            }
        })

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[ADD TRANSAKSI]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}
