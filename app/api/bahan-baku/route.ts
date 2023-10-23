import { db } from '@/lib/db'
import { BahanBaku } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const { nama, satuan, stok, hargaPerSatuan, cabangId } = values
        const parseStok = parseFloat(stok)
        const parseHarga = parseFloat(hargaPerSatuan)

        const bahan = await db.bahanBaku.create({
            data: {
                nama,
                satuan,
                stok: parseStok,
                hargaPerSatuan: parseHarga,
                cabangId
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[ADD BAHAN BAKU]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET() {
    try {
        const bahan = await db.bahanBaku.findMany({
            orderBy: {
                id: 'asc'
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[GET BAHAN BAKU]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
