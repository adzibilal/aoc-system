'use client'

import { KategoriProduk, Pengguna } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const columns: ColumnDef<KategoriProduk>[] = [
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Nama Kategori
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        id: 'actions',
        cell: ({ table, row }) => {
            const { id } = row.original

            return (
                <div className='flex items-center gap-3'>
                    <Button
                        variant='destructive'
                        size='sm'
                        className='w-max'
                        //@ts-ignore
                        onClick={() => table?.options?.meta?.handleDelete(id)}>
                        <Trash className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='default'
                        size='sm'
                        className='w-max'
                        //@ts-ignore
                        onClick={() => table?.options?.meta?.handleEdit(row.original)}>
                        <Pencil className='h-4 w-4' />
                    </Button>
                </div>
            )
        }
    }
]
