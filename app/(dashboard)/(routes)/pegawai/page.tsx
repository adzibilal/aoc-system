import { db } from "@/lib/db"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"

const PegawaiPage = async () => {
    const pengguna = await db.pengguna.findMany()
    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold'>Data Pengguna</h1>
            <DataTable columns={columns} data={pengguna} />
        </div>
    )
}

export default PegawaiPage
