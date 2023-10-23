import { db } from '@/lib/db'
import { Produk } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const { nama, deskripsi, harga, cabangId, kategoriProdukId } =
            values as Produk
        const parseHarga = parseFloat(harga.toString())

        const produk = await db.produk.create({
            data: {
                nama,
                deskripsi,
                harga: parseHarga,
                cabangId,
                kategoriProdukId
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[ADD PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}


