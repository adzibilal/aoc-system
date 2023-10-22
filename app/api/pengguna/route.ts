import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
    req: Request
) {
    try {
        const pengguna = await db.pengguna.findMany()

        return NextResponse.json(pengguna)
    } catch (error) {
        console.log('[GET SPESIFIC CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(
    req: Request
) {
    try {
        const values = await req.json()

        const pengguna = await db.pengguna.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(pengguna)
    } catch (error) {
        console.log('[ADD CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}