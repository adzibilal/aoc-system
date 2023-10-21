import React from 'react'
import { NextPage } from 'next'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { db } from '@/lib/db'

const CabangPage: NextPage = async () => {
    const cabang = await db.cabang.findMany()

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Cabang</h1>
            {/* Add your content here */}
            <DataTable columns={columns} data={cabang} />
        </div>
    )
}

export default CabangPage
