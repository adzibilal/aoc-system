'use client'
import * as z from 'zod'
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
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Combobox } from '@/components/ui/combobox'
import { rupiahFormat } from '@/lib/utils'

interface ProdukFormProps {
    initialData: {
        nama: string
        deskripsi?: string | null
        harga: number
        kategoriProdukId?: string | null
    }
    produkId?: string
    kategori?: string
}

const formSchema = z.object({
    nama: z
        .string()
        .min(1, {
            message: 'Nama Bahan Baku wajib di isi'
        })
        .max(50, {
            message: 'Nama Bahan Baku maksimal 50 karakter'
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
    kategoriProdukId: z.string().min(1, {
        message: 'Kategori wajib di isi'
    })
})
interface dataKategori {
    label: string
    value: string
}

export const ProdukForm = ({
    initialData,
    produkId,
    kategori
}: ProdukFormProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [dataKategori, setDataKategori] = useState<dataKategori[]>([])

    const toggleEdit = () => setIsEditing(current => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialData,
            harga: initialData.harga.toString(),
            kategoriProdukId: initialData.kategoriProdukId ?? undefined,
            deskripsi: initialData.deskripsi ?? ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.patch(`/api/produk/${produkId}`, values)
            toast.dismiss()
            toast.success('Produk updated')
            toggleEdit()
            router.refresh()
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
    }, [produkId])

    return (
        <div className='mt-6 border bg-zinc-50 rounded-md p-4 w-full h-full'>
            <div className='flex font-medium items-center justify-between'>
                Detail Produk
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className='h-4 mr-2 w-4' />
                            Edit Produk
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <>
                    <p className='mt-2 font-bold text-2xl'>
                        {initialData.nama}
                    </p>
                    <p className='mt-2 text-zinc-600 text-sm'>
                        {initialData.deskripsi}
                    </p>
                    <p className='mt-2 text-sm'>{rupiahFormat(initialData.harga)}</p>
                    <p className='mt-2  text-sm'>{kategori}</p>
                </>
            ) : (
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
                            <Button
                                disabled={!isValid || isSubmitting}
                                type='submit'>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
