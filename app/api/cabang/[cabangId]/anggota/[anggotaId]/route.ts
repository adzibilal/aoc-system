import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

//buatkan fungsi DELETE untuk menghapus anggota cabang
export async function DELETE(
    req: Request,
    { params }: { params: { anggotaId: string } }
) {
    try {
        const anggota = await db.anggotaCabang.delete({
            where: {
                id: params.anggotaId
            }
        })

        return NextResponse.json(anggota)
    } catch (error) {
        console.log('[DELETE ANGOTA]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
