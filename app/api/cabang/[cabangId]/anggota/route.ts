import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const { cabangId } = params
        const values = await req.json()

        const anggota = await db.anggotaCabang.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(anggota)
    } catch (error) {
        console.log('[ADD ANGOTA]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params }: { params: { cabangId: string } }
) {
    try {
        const { cabangId } = params

        // Ambil semua data anggotaCabang yang memiliki cabangId yang sama dengan parameter yang diberikan
        const anggotaCabang = await db.anggotaCabang.findMany({
            where: {
                cabangId: cabangId
            }
        })

        // Ambil semua data pengguna
        const pengguna = await db.pengguna.findMany()

        // Buat array kosong untuk menampung pengguna yang tidak memiliki relasi dengan cabangId di tabel anggotaCabang
        const penggunaTanpaRelasi = []

        // Loop melalui semua data pengguna
        for (const p of pengguna) {
            let memilikiRelasi = false

            // Dalam setiap iterasi, periksa apakah pengguna saat ini memiliki relasi dengan cabangId di tabel anggotaCabang
            for (const a of anggotaCabang) {
                if (p.id === a.penggunaId) {
                    memilikiRelasi = true
                    break
                }
            }

            // Jika pengguna tidak memiliki relasi, tambahkan pengguna ke dalam array yang telah dibuat pada langkah 3
            if (!memilikiRelasi) {
                penggunaTanpaRelasi.push(p)
            }
        }

        // Setelah selesai looping, kembalikan array pengguna yang tidak memiliki relasi dengan cabangId di tabel anggotaCabang
        return NextResponse.json(penggunaTanpaRelasi)
    } catch (error) {
        console.log('[GET NOT ANGOTA CABANG]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

