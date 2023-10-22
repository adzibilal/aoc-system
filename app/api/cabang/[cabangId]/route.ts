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

export async function PATCH(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const { cabangId } = params
        const values = await req.json()

        const course = await db.cabang.update({
            where: {
                id: cabangId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log('[UPDATE CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const cabang = await db.cabang.delete({
            where: {
                id: params.cabangId
            }
        })

        return NextResponse.json(cabang)
    } catch (error) {
        console.log('[DELETE CABANG]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}
