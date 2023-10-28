'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem
} from '@/components/ui/command'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/db'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Pengguna } from '@prisma/client'
import { Combobox } from '@/components/ui/combobox'

interface AddAnggotaProps {
    onClose: () => void
    cabangId?: string
}

interface dataPengguna {
    label: string
    value: string
}

const AddAnggota = ({ onClose, cabangId }: AddAnggotaProps) => {
    const [dataPengguna, setDataPengguna] = useState<dataPengguna[]>([])
    const router = useRouter()

    const formSchema = z.object({
        penggunaId: z.string().min(1),
        cabangId: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            penggunaId: '',
            cabangId: cabangId
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.post(`/api/cabang/${cabangId}/anggota`, values)
            toast.dismiss()
            toast.success('Cabang updated')
            onClose()
            router.refresh()
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong')
        }
    }

    const getPengguna = async () => {
        try {
            // console.error(values)
            const pengguna = await axios.get(`/api/cabang/${cabangId}/anggota`)

            setDataPengguna(
                pengguna.data.map((item: { nama: string; id: string }) => ({
                    label: item.nama,
                    value: item.id
                }))
            )
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        const getPengguna = async () => {
            try {
                const pengguna = await axios.get(`/api/cabang/${cabangId}/anggota`)
                setDataPengguna(
                    pengguna.data.map((item: { nama: string; id: string }) => ({
                        label: item.nama,
                        value: item.id
                    }))
                )
            } catch (error) {
                toast.error('Something went wrong')
            }
        }
        getPengguna()
    }, [cabangId])

    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='font-bold text-xl mb-5'>Tambah Anggota</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='penggunaId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pengguna</FormLabel>
                                    <Combobox
                                        options={...dataPengguna}
                                        {...field}
                                    />
                                    <FormDescription>
                                       Pilih pengguna yang akan di tambahkan ke anggota cabang
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default AddAnggota
