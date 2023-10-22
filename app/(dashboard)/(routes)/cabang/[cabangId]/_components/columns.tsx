'use client'

import { Pengguna } from '@prisma/client'
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

export const columns: ColumnDef<Pengguna>[] = [
    {
        accessorKey: 'nama',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Nama Anggota
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'username',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Username
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        }
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Role
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        cell: ({ row }) => {
            const role = row.getValue('role')
            switch (role) {
                case 'admin':
                    return <Badge>Admin</Badge>
                    break
                case 'staff':
                    return <Badge variant='outline'>Staff</Badge>
                    break
                default:
                    break
            }
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
          const { id } = row.original
          return (
            <Button variant='destructive' className='w-max'>
              <Trash className='h-4 w-4' />
            </Button>
          )
        }
    }
]
