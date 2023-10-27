import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request, {params}: {params: {cabangId: string}}) {
    try {
        const transaksi = await db.pesanan.findMany({
            where: {
                cabangId: params.cabangId,
                status: 'BELUM DIBAYAR'
            },
        })

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[ADD TRANSAKSI UNPAY]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}
