import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const values = await req.json()

        if (!values.transaksi.itemCart) {
            return new NextResponse('itemCart is missing in the payload', {
                status: 400
            })
        }

        const transaksi = await db.pesanan.create({
            data: {
                tanggal: new Date(),
                namaPelanggan: values.transaksi.namaPelanggan ?? '-',
                nomorMeja: values.transaksi.noMeja ?? null,
                cabangId: values.transaksi.cabangId,
                penggunaId: values.transaksi.penggunaId,
                status: values.transaksi.status ?? 'BELUM DIBAYAR',
                DetailPesanan: {
                    create: values.transaksi.itemCart.map((item: any) => ({
                        jumlah: item.qty,
                        produkId: item.item.id,
                        hargaSatuan: item.item.harga,
                        subtotal: item.item.harga * item.qty
                    }))
                }
            }
        })

        if (values.transaksi.status === 'LUNAS') {
            for (const item of values.transaksi.itemCart) {
                const resep = await db.resep.findMany({
                    where: {
                        produkId: item.item.id
                    }
                })

                if (resep.length > 0) {
                    for (const bahan of resep) {
                        const bahanBaku = await db.bahanBaku.findUnique({
                            where: {
                                id: bahan.bahanBakuId
                            }
                        })

                        if (!bahanBaku) {
                            return new NextResponse(
                                `Bahan baku ${bahan.bahanBakuId} tidak ditemukan`,
                                { status: 404 }
                            )
                        }

                        // Calculate the required stock based on item quantity (item.qty)
                        const requiredStock = bahan.jumlah * item.qty

                        if (bahanBaku.stok < requiredStock) {
                            const errorMessage = `Stok bahan baku ${bahanBaku.nama} tidak mencukupi`
                            const responseMessage = { message: errorMessage }

                            return new NextResponse(
                                JSON.stringify(responseMessage),
                                {
                                    status: 400,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }
                            )
                        }

                        await db.bahanBaku.update({
                            where: {
                                id: bahan.bahanBakuId
                            },
                            data: {
                                stok: bahanBaku.stok - requiredStock
                            }
                        });
                    }
                }
            }
        }

        return NextResponse.json(transaksi)
    } catch (error) {
        console.log('[ADD TRANSAKSI]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}
