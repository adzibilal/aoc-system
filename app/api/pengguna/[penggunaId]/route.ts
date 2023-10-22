import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { penggunaId: string } }
) {
    try {
        const { penggunaId } = params

        const pengguna = await db.pengguna.delete({
            where: {
                id: penggunaId
            }
        })

        return NextResponse.json(pengguna)
    } catch (error) {
        console.log('[DELETE PENGGUNA]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { penggunaId: string } }
) {
    try {
        const { penggunaId } = params
        const values = await req.json()

        const pengguna = await db.pengguna.update({
            where: {
                id: penggunaId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(pengguna)
    } catch (error) {
        console.log('[UPDATE PENGGUNA]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}