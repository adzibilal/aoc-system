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