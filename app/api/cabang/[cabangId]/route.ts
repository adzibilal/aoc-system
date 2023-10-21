import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const cabang = await db.cabang.findUnique({
            where: {
                id: params.cabangId
            }
        })

        return NextResponse.json(cabang)
    } catch (error) {
        console.log('[GET SPESIFIC CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
