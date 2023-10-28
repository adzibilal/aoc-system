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
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'

interface AddBahanBakuProps {
    onClose: () => void
    onSuccess: () => void
    cabangId?: string
}

const AddBahanBaku = ({ onClose, onSuccess, cabangId }: AddBahanBakuProps) => {
    const router = useRouter()

    const formSchema = z.object({
        nama: z
            .string()
            .min(1, {
                message: 'Nama Bahan Baku wajib di isi'
            })
            .max(50, {
                message: 'Nama Bahan Baku maksimal 50 karakter'
            }),
        satuan: z
            .string()
            .min(1, {
                message: 'Satuan wajib di isi'
            })
            .max(50, {
                message: 'Satuan maksimal 50 karakter'
            }),
        stok: z.string().min(1, {
            message: 'Stok wajib di isi'
        }),
        hargaPerSatuan: z.string().min(1, {
            message: 'Harga per satuan wajib di isi'
        }),
        kategori: z.string().min(1, {
            message: 'Kategori wajib di isi'
        }),
        cabangId: z.string().min(1, {
            message: 'Cabang wajib di isi'
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: '',
            satuan: '',
            stok: '0',
            hargaPerSatuan: '0',
            kategori: '',
            cabangId: cabangId
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')

            await axios.post(`/api/bahan-baku/`, values)
            toast.dismiss()
            toast.success('Bahan Baku ditambahkan')
            onClose()
            router.refresh()
            onSuccess()
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong')
        }
    }

    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='font-bold text-xl mb-5'>Tambah Bahan Baku</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='nama'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Bahan Baku</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama Bahan Baku ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='satuan'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Satuan</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                {
                                                    value: 'gr',
                                                    label: 'Gram'
                                                },
                                                {
                                                    value: 'ml',
                                                    label: 'Mililiter'
                                                },
                                                {
                                                    value: 'pcs',
                                                    label: 'Pcs'
                                                },
                                                {
                                                    value: 'kg',
                                                    label: 'Kilogram'
                                                },
                                                {
                                                    value: 'botol',
                                                    label: 'Botol'
                                                },
                                                {
                                                    value: 'bungkus',
                                                    label: 'Bungkus'
                                                },
                                                {
                                                    value: 'kotak',
                                                    label: 'Kotak'
                                                },
                                            ]}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='stok'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stok</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Stok ...'
                                            {...field}
                                            type='number'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='hargaPerSatuan'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga Per Satuan</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Harga Per Satuan ...'
                                            type='number'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='kategori'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                {
                                                    value: 'Liquid',
                                                    label: 'Liquid'
                                                },
                                                {
                                                    value: 'Syrup',
                                                    label: 'Syrup'
                                                },
                                                {
                                                    value: 'Powder',
                                                    label: 'Powder'
                                                },
                                                {
                                                    value: 'Coffee Beans',
                                                    label: 'Coffee Beans'
                                                },
                                                {
                                                    value: 'Tea bag',
                                                    label: 'Tea bag'
                                                },
                                                {
                                                    value: 'Other',
                                                    label: 'Other'
                                                },
                                            ]}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex items-center gap-x-2'>
                            <Button disabled={isSubmitting} type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default AddBahanBaku
