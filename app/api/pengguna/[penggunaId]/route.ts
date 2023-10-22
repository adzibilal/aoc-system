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
        console.log('[DELETE CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
