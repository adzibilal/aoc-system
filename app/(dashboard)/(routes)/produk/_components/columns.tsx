'use client'

import { Produk } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import {
    ArrowUpDown,
    Badge,
    BookMarked,
    Pencil,
    Trash
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { rupiahFormat } from '@/lib/utils'

interface ColumnProduk {
    id: string
    nama: string
    deskripsi?: string
    harga: number
    cabangId: string
    kategoriProdukId: string
    kategori: {
        id: string
        nama: string
    }
}

export const columns: ColumnDef<ColumnProduk>[] = [
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
        accessorKey: 'deskripsi',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Deskripsi
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'harga',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Harga
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const harga = row?.original?.harga

            return <div>{rupiahFormat(harga)}</div>
        }
    },
    // buat column kategori.nama
    {
        accessorKey: 'kategori.nama',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Kategori
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const nama = row?.original?.kategori?.nama

            return <div>{nama}</div>
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
                    {/* <Button
                        variant='default'
                        size='sm'
                        className='w-max'
                        onClick={() =>
                            //@ts-ignore
                            table?.options?.meta?.handleEdit(row.original)
                        }>
                        <Pencil className='h-4 w-4' />
                    </Button> */}
                    <Link href={`/produk/${id}`}>
                        <Button variant='outline' size='sm' className='w-max'>
                            <Pencil className='h-4 w-4' />
                        </Button>
                    </Link>
                </div>
            )
        }
    }
]
