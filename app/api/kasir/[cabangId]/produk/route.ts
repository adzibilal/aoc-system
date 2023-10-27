import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { cabangId: string } }) {
    try {
        const produk = await db.produk.findMany({
            where: {
                cabangId: params.cabangId
            },
            include: {
                kategori: true,
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[GET PRODUK KASIR]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
