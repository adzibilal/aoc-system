'use client'

import { Pengguna, Resep } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface ResepColumn {
    id: string
    nama: string
    jumlah: number
    satuan: string
}
export const columns: ColumnDef<ResepColumn>[] = [
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Nama Bahan
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'jumlah',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Jumlah
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'satuan',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Satuan
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
                <Button
                    variant='destructive'
                    className='w-max' //@ts-ignore
                    onClick={() => table?.options?.meta?.handleDelete(id)}>
                    <Trash className='h-4 w-4' />
                </Button>
            )
        }
    }
]
