import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        const bahan = await db.inventory.create({
            data: {
                name: values.name,
                cabangId: values.cabangId
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[ADD INVENTORY]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}