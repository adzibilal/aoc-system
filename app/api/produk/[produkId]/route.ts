import { db } from '@/lib/db'
import { Produk } from '@prisma/client'
import { NextResponse } from 'next/server'

// delete produk
export async function DELETE(
    req: Request,
    { params }: { params: { produkId: string } }
) {
    try {
        const produk = await db.produk.delete({
            where: {
                id: params.produkId
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[DELETE PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

// PATCH produk
export async function PATCH(
    req: Request,
    { params }: { params: { produkId: string } }
) {
    try {
        const values = await req.json()

        const { nama, deskripsi, harga, cabangId, kategoriProdukId } =
            values as Produk
        const parseHarga = parseFloat(harga.toString())

        const produk = await db.produk.update({
            where: {
                id: params.produkId
            },
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
        console.log('[UPDATE PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
