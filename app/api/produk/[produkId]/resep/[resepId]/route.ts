import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// delete resep
export async function DELETE(
    req: Request,
    { params }: { params: { resepId: string } }
) {
    try {
        const resep = await db.resep.delete({
            where: {
                id: params.resepId
            }
        })

        return NextResponse.json(resep)
    } catch (error) {
        console.log('[DELETE RESEP]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
