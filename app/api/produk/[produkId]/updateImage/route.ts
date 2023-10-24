import { db } from "@/lib/db"
import { NextResponse } from "next/server"

// PATCH produk
export async function PATCH(
    req: Request,
    { params }: { params: { produkId: string } }
) {
    try {
        const values = await req.json()

        const produk = await db.produk.update({
            where: {
                id: params.produkId
            },
            data: {
                image: values.image,
            }
        })

        return NextResponse.json(produk)
    } catch (error) {
        console.log('[UPDATE PRODUK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
