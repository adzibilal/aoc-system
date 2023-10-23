import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const produk = await db.produk.findMany({
            where: {
                cabangId: params.cabangId
            },
            include: {
                kategori: true
            },
            orderBy: {
                id: 'asc'
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[GET PRODUK BAKU BY CABANG ID]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
