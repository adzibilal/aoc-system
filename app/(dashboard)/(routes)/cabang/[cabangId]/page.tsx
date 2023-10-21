import { db } from '@/lib/db'
import { useEffect } from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const CabangIdPage = async ({ params }: { params: { cabangId: string } }) => {
    const cabang = await db.cabang.findUnique({
        where: {
            id: params.cabangId
        }
    })

    const anggota = await db.anggotaCabang.findMany({
        where: {
            cabangId: params.cabangId
        },
        include: {
            pengguna: true
        }
    })

    const formattedAnggota = anggota.map(item => ({
        id: item.id,
        nama: item.pengguna.nama,
        username: item.pengguna.username,
        role: item.pengguna.role,
        password: item.pengguna.password
    }))

    return (
        <div className='p-6'>
            <Link href='/cabang'>
            <Button className='mb-4' variant='outline'>
                <ArrowLeftIcon className='mr-3'/>
                Kembali
            </Button>
            </Link>
            <div className=''>{cabang?.nama}</div>
            <DataTable columns={columns} data={formattedAnggota} />
        </div>
    )
}

export default CabangIdPage
