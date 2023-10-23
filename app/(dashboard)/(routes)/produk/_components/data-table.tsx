'use client'

import * as React from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { BahanBaku, Produk } from '@prisma/client'
import AddBahanBaku from './add-produk'
import { on } from 'stream'
import EditBahanBaku from './edit-produk'
import EditProduk from './edit-produk'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    cabangId?: string
    onDataChange: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    cabangId,
    onDataChange
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])

    const [isAdding, setIsAdding] = React.useState(false)
    const [isEditing, setIsEditing] = React.useState(false)
    const [dataEdit, setDataEdit] = React.useState<Produk>({
        id: '',
        nama: '',
        deskripsi: '',
        harga: 0,
        cabangId: cabangId!,
        kategoriProdukId: ''
    })

    const handleDelete = async (id: string) => {
        toast.loading('Loading...')
        try {
            await axios.delete(`/api/produk/${id}`)
            onDataChange()
            toast.success('Produk berhasil dihapus')
        } catch (error) {
            console.log(error)
            toast.error('Produk gagal dihapus')
        } finally {
            setTimeout(() => {
                toast.dismiss()
            }, 1000)
            router.refresh()
        }
    }
    const handleEdit = (produk: Produk) => {
        setDataEdit(produk)
        setIsEditing(true)
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        },
        meta: {
            cabangId,
            handleDelete: (id: string) => handleDelete(id),
            handleEdit: (produk: Produk) => handleEdit(produk)
        }
    })

    return (
        <div>
            <div className='flex items-center py-4 justify-between max-md:grid max-md:grid-cols-1 gap-3'>
                <Input
                    placeholder='Cari Produk...'
                    value={
                        (table.getColumn('nama')?.getFilterValue() as string) ??
                        ''
                    }
                    onChange={event =>
                        table
                            .getColumn('nama')
                            ?.setFilterValue(event.target.value)
                    }
                    className='max-w-sm'
                />
                <div className='flex items-center gap-3'>
                    <Button
                        onClick={() => {
                            setIsAdding(!isAdding)
                        }}>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Tambah Produk
                    </Button>
                </div>
                {isAdding && <AddBahanBaku onSuccess={onDataChange} onClose={() => setIsAdding(false)} cabangId={cabangId}/>}
                {isEditing && (
                    <EditProduk
                        initialData={dataEdit}
                        onClose={() => setIsEditing(false)}
                        onSuccess={onDataChange}
                        cabangId={cabangId!}
                    />
                )}
            </div>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}
