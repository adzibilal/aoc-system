import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const barang = await db.inventory.findMany({
            where: {
                cabangId: params.cabangId
            },
            orderBy: {
                id: 'asc'
            }
        })

        return NextResponse.json(barang)
    } catch (error) {
        console.log('[GET INVENTORY BY CABANG ID]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
