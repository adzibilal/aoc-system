import { db } from '@/lib/db'
import { Produk, Resep } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { produkId: string } }
) {
    try {
        const produk = await db.resep.findUnique({
            where: {
                id: params.produkId
            },
            include: {
                BahanBaku: true
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[GET RESEP PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

// export async function POST

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const { jumlah, produkId, bahanBakuId } = values as Resep
        const parseJumlah = parseFloat(jumlah.toString())

        const resep = await db.resep.create({
            data: {
                jumlah: parseJumlah,
                produkId,
                bahanBakuId
            }
        })

        return NextResponse.json(resep)
    } catch (error) {
        console.log('[ADD RESEP]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
