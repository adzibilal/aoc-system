import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const cabang = await db.cabang.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(cabang)
    } catch (error) {
        console.log('[ADD ANGOTA]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
