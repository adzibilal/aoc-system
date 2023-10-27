import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId
        if (!userId) {
            return new NextResponse(
                'Missing userId parameter in the request.',
                { status: 400 }
            )
        }

        const myCabang = await db.anggotaCabang.findMany({
            where: {
                penggunaId: userId
            },
            include: {
                cabang: true
            }
        })

        return NextResponse.json(myCabang)
    } catch (error) {
        console.error('[CABANG USER]', error)
        return new NextResponse(`CABANG USER ${error ? error : ''}`, {
            status: 500
        })
    }
}
