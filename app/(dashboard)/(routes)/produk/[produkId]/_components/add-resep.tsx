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

interface AddResepProps {
    onClose: () => void
    onSuccess: () => void
    cabangId?: string
    produkId?: string
}

interface dataBahanBaku {
    label: string
    value: string
}

const AddResep = ({
    onClose,
    onSuccess,
    cabangId,
    produkId
}: AddResepProps) => {
    const [dataBahanBaku, setDataBahanBaku] = useState<dataBahanBaku[]>([])

    const router = useRouter()

    const formSchema = z.object({
        jumlah: z.string().min(1, { message: 'Jumlah wajib di isi' }),
        bahanBakuId: z.string().min(1, { message: 'Bahan Baku wajib di isi' }),
        produkId: z.string().min(1, { message: 'Produk wajib di isi' })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jumlah: '',
            bahanBakuId: '',
            produkId: produkId
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            toast.loading('Loading...')
            // console.error(values)
            await axios.post(`/api/produk/${produkId}/resep`, values)
            toast.dismiss()
            toast.success('Resep ditambahkan')
            onClose()
            router.refresh()
            onSuccess()
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong')
        }
    }

    useEffect(() => {
        const getBahanBaku = async () => {
            try {
                const bahanBaku = await axios.get(
                    `/api/cabang/${cabangId}/bahan-baku`
                )
                setDataBahanBaku(
                    bahanBaku.data.map(
                        (item: { nama: string; id: string }) => ({
                            label: item.nama,
                            value: item.id
                        })
                    )
                )
            } catch (error) {
                toast.error('Something went wrong')
            }
        }
        getBahanBaku()
    }, [cabangId])

    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='font-bold text-xl mb-5'>Tambah Resep</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='bahanBakuId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bahan Baku</FormLabel>
                                    <Combobox
                                        options={...dataBahanBaku}
                                        {...field}
                                    />
                                    <FormDescription>
                                        Pilih Bahan Baku
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='jumlah'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jumlah bahan</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            disabled={isSubmitting}
                                            placeholder='Jumlah bahan ...'
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

export default AddResep
