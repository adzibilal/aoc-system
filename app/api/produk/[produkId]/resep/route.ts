import { db } from '@/lib/db'
import { Produk } from '@prisma/client'
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
