'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

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

interface dataKategori {
    label: string
    value: string
}

const AddBahanBaku = ({ onClose, onSuccess, cabangId }: AddBahanBakuProps) => {
    const [dataKategori, setDataKategori] = useState<dataKategori[]>([])

    const router = useRouter()

    const formSchema = z.object({
        nama: z
            .string()
            .min(1, {
                message: 'Nama Produk wajib di isi'
            })
            .max(50, {
                message: 'Nama Produk maksimal 50 karakter'
            }),
        deskripsi: z.string().optional(),
        harga: z
            .string()
            .min(1, {
                message: 'Harga wajib di isi'
            })
            .max(50, {
                message: 'Harga maksimal 50 karakter'
            }),
        cabangId: z.string().min(1, {
            message: 'Cabang wajib di isi'
        }),
        kategoriProdukId: z.string().min(1, {
            message: 'Kategori wajib di isi'
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: '',
            deskripsi: '',
            harga: '',
            cabangId: cabangId,
            kategoriProdukId: ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            toast.loading('Loading...')
            // console.error(values)
            await axios.post(`/api/produk/`, values)
            toast.dismiss()
            toast.success('Produk ditambahkan')
            onClose()
            router.refresh()
            onSuccess()
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        const getPengguna = async () => {
            try {
                const kategori = await axios.get(`/api/kategori`)
                setDataKategori(
                    kategori.data.map((item: { nama: string; id: string }) => ({
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
                <div className='font-bold text-xl mb-5'>Tambah Produk</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='nama'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Produk</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama Produk ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='deskripsi'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deskripsi</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Deskripsi ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='harga'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Harga ...'
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
                            name='kategoriProdukId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Combobox
                                        options={...dataKategori}
                                        {...field}
                                    />
                                    <FormDescription>
                                        Pilih kategori produk
                                    </FormDescription>
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
