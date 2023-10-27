import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request, {params}: {params: {transaksiId: string}}) {
    try {
        const transaksi = await db.pesanan.findUnique({
            where: {
                id: params.transaksiId
            },
            include: {
                DetailPesanan: {
                    include: {
                        Produk: {
                            include: {
                                kategori: true
                            }
                        }   
                    }
                }
            }
        })

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[ADD TRANSAKSI BY ID]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: { transaksiId: string } }
) {
    try {
        const { transaksiId } = params
        const values = await req.json()

        const course = await db.pesanan.update({
            where: {
                id: transaksiId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log('[UPDATE STATUS TRANSAKSI]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
