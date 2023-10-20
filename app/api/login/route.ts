import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json()

        const user = await db.pengguna.findUnique({
            where: {
                username,
                password
            }
        })
        
        return NextResponse.json(user)
    } catch (error) {
        console.log('[LOGIN]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
