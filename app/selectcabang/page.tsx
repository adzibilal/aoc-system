'use client'
import * as React from 'react'
import { NextPage } from 'next'
import { PrismaClient } from '@prisma/client'
import { Cabang, SessionData } from '@/types'
import { useEffect, useState } from 'react'
import { db } from '@/lib/db'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { CaretSortIcon, CheckIcon, CheckboxIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

const HomePage: NextPage = () => {
    const [open, setOpen] = useState(false)
    const [selectedCabang, setSelectedCabang] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const router = useRouter()
    const session: string | null = localStorage.getItem('session')
    const { user }: SessionData = JSON.parse(session || '{}')
    if (!user) {
        router.push('/sign-in')
    }
    const userId = user.id
    const [cabang, setCabang] = useState<Cabang[]>([])

    const getCabangByUserId = async (userId: string) => {
        try {
            const response = await axios.get(
                `/api/cabang-user?userId=${userId}`
            )
            setCabang(response.data)
        } catch (error) {
            toast.error('Something went wrong')
        }
    }
    const dataCabang = cabang.map(item => ({
        value: item.id,
        label: item.nama
    }))

    useEffect(() => {
        getCabangByUserId(userId)
    }, [userId])

    const handleCabangSelect = (cabangId: string) => {
        setSelectedCabang(cabangId)
        setOpen(false)
    }
    const filteredCabang = dataCabang.filter(cabang =>
        cabang.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async () => {
        if (!selectedCabang) {
            toast.error('Pilih cabang terlebih dahulu')
        } else {
            localStorage.setItem('selectedCabang', selectedCabang)
            console.error(selectedCabang)
            router.push('/')
        }
    }
    
    return (
        <div className='w-screen h-screen flex items-center justify-center flex-col'>
            <Image
                src='/logo-white.png'
                width={200}
                height={150}
                alt=''
                className='invert'
            />
            <h1 className='py-5 text-2xl text-center font-semibold'>
                Silahkan Pilih Cabang
            </h1>

            <div className='max-w-md w-full flex flex-col max-md:p-3'>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className='w-full justify-between border p-2 rounded flex items-center'
                            onClick={() => setOpen(!open)}>
                            {selectedCabang
                                ? dataCabang.find(
                                      cabang => cabang.value === selectedCabang
                                  )?.label
                                : 'Pilih Cabang...'}
                            <CaretSortIcon className='ml-2 h-4 w-4' />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-2 border rounded'>
                        <Command className='w-full'>
                            <Input
                                placeholder='Cari cabang...'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {filteredCabang.length === 0 && (
                                <CommandEmpty>
                                    Tidak ada cabang ditemukan.
                                </CommandEmpty>
                            )}
                            <CommandGroup>
                                {filteredCabang.map(cabang => (
                                    <CommandItem
                                        key={cabang.value}
                                        onSelect={() =>
                                            handleCabangSelect(cabang.value)
                                        }>
                                        {cabang.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Button className='w-[80%] mx-auto mt-5' onClick={handleSubmit}>
                    Pilih Cabang
                </Button>
            </div>
        </div>
    )
}

export default HomePage
