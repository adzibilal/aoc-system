import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const recentSales = await db.pesanan.findMany({
            where: {
                cabangId: params.cabangId
            },
            orderBy: {
                tanggal: 'desc'
            },
            include: {
                DetailPesanan: true,
                Pengguna: true
            },
            take: 5
        })

        const totalTransaksiThisMonth = await db.pesanan.findMany({
            where: {
                cabangId: params.cabangId,
                tanggal: {
                    gte: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    ),
                    lte: new Date()
                }
            },
            include: {
                DetailPesanan: true
            }
        })

        const bahanBakuHabis = await db.bahanBaku.findMany({
            where: {
                cabangId: params.cabangId,
                stok: {
                    lte: 0
                }
            }
        })


        const totalRevenueThisMonth = totalTransaksiThisMonth.reduce(
            (acc, curr) => {
                return acc + curr.DetailPesanan.reduce((acc, curr) => {
                    return acc + curr.subtotal
                }, 0)
            },
            0
        )

        const todayTransaction = await db.pesanan.findMany({
            where: {
                cabangId: params.cabangId,
                tanggal: {
                    gte: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate()
                    ),
                    lte: new Date()
                }
            },
            include: {
                DetailPesanan: true
            }
        })

        const totalRevenueToday = todayTransaction.reduce(
            (acc, curr) => {
                return acc + curr.DetailPesanan.reduce((acc, curr) => {
                    return acc + curr.subtotal
                }, 0)
            },
            0
        )

        const getBestSeller = await db.detailPesanan.groupBy({
            by: ['produkId'],
            where: {
                Pesanan: {
                    cabangId: params.cabangId,
                    tanggal: {
                        gte: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                        ),
                        lte: new Date()
                    }
                }
            },
            _count: {
                produkId: true
            },
            _sum: {
                subtotal: true
            },
            orderBy: {
                _count: {
                    produkId: 'desc'
                }
            },
            take: 1,
        })

        const bestSellerProduk = await db.produk.findMany({
            where: {
                id: {
                    in: getBestSeller.map((item) => item.produkId)
                }
            }
        })

        const bestSeller = {
            produk: bestSellerProduk[0],
            total_penjualan: getBestSeller[0]._count.produkId,
            total_pendapatan: getBestSeller[0]._sum.subtotal
        }

        const data = {
            recentSales,
            total_transaction_thismonth: totalTransaksiThisMonth.length,
            bahanBakuHabis: bahanBakuHabis.length,
            totalRevenueThisMonth,
            totalRevenueToday,
            bestSeller
        }

        return NextResponse.json(data)
    } catch (error) {
        console.log('[GET DASHBOARD BY CABANG ID]', error)
        return new NextResponse(`Internal Error ${error}`, { status: 500 })
    }
}
