import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId')
        if (!userId) {
            return new NextResponse(
                'Missing userId parameter in the request.',
                { status: 400 }
            )
        }

        const cabang = await db.cabang.findMany({
            include: {
                AnggotaCabang: {
                    where: {
                        penggunaId: { equals: userId as string }
                    }
                }
            }
        })

        return NextResponse.json(cabang)
    } catch (error) {
        console.error('[CABANG USER]', error)
        return new NextResponse(`CABANG USER ${error ? error : ''}`, {
            status: 500
        })
    }
}
