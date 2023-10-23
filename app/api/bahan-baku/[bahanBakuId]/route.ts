import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { bahanBakuId: string } }
) {
    try {
        const { bahanBakuId } = params

        const bahan = await db.bahanBaku.delete({
            where: {
                id: bahanBakuId
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[DELETE BAHAN BAKU]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { bahanBakuId: string } }
) {
    try {
        const { bahanBakuId } = params
        const values = await req.json()

        const { nama, satuan, stok, hargaPerSatuan, cabangId } = values
        const parseStok = parseFloat(stok)
        const parseHarga = parseFloat(hargaPerSatuan)

        const bahan = await db.bahanBaku.update({
            where: {
                id: bahanBakuId
            },
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
        console.log('[UPDATE BAHAN BAKU]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}