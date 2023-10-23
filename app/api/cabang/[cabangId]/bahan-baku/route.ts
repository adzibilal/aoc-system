import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const bahan = await db.bahanBaku.findMany({
            where: {
                cabangId: params.cabangId
            },
            orderBy: {
                id: 'asc'
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[GET BAHAN BAKU BY CABANG ID]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
