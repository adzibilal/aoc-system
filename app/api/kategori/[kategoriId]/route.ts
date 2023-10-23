import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    { params }: { params: { kategoriId: string } }
) {
    try {
        const { kategoriId } = params
        const values = await req.json()

        const kategori = await db.kategoriProduk.update({
            where: {
                id: kategoriId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[UPDATE KATEGORI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { kategoriId: string } }
) {
    try {
        const { kategoriId } = params

        const kategori = await db.kategoriProduk.delete({
            where: {
                id: kategoriId
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.log('[DELETE KATEGORI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}