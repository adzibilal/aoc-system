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
import { Card } from '@/components/ui/card'
import { Store } from 'lucide-react'

const HomePage = ({ params }: { params: { userId: string } }) => {
    const [open, setOpen] = useState(false)
    const [selectedCabang, setSelectedCabang] = useState<string | null>(null)

    const router = useRouter()
    const userId = params.userId
    const [cabang, setCabang] = useState([])

    const getCabangByUserId = async (userId: string) => {
        try {
            const response = await axios.get(`/api/cabang-user/${userId}`)
            setCabang(response.data)
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        getCabangByUserId(userId)
    }, [userId])

    const handleCabangSelect = (cabangId: string) => {
        setSelectedCabang(cabangId)
        setOpen(false)
    }

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

            <div className='w-full flex items-center flex-col max-md:p-3'>
                <div className='flex gap-3 items-center justify-center flex-wrap md:w-[60%] max-sm:w-[100%] max-sm:p-4'>
                    {cabang.map((item: any) => (
                        <Card
                            key={item.cabang.id}
                            className='w-[300px] max-sm:w-[100%] p-3 relative cursor-pointer'
                            onClick={() => handleCabangSelect(item.cabang.id)}>
                            {selectedCabang === item.cabang.id && (
                                <div className='absolute top-0 right-0 p-2 text-green-600'>
                                    <CheckboxIcon className='h-5 w-5' />
                                </div>
                            )}
                            <div className='flex flex-col'>
                                <div className='text-lg font-bold mb-1'>
                                    {item.cabang.nama}
                                </div>
                                <div className='text-sm line-clamp-1'>
                                    {item.cabang.alamat}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <Button
                    className='max-md:w-[80%] w-[20%] mx-auto mt-5'
                    onClick={handleSubmit}>
                    Pilih Cabang
                </Button>
            </div>
        </div>
    )
}

export default HomePage
