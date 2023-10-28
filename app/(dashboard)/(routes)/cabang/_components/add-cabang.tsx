'use client'
import React from 'react'
import { z } from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

interface AddCabangProps {
    onClose: () => void
}

const AddCabang = ({ onClose }: AddCabangProps) => {
    const router = useRouter()

    const formSchema = z.object({
        nama: z.string().min(1),
        alamat: z.string().min(1),
        email: z.string().min(1),
        nomorTelepon: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: '',
            alamat: '',
            email: '',
            nomorTelepon: ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.post(`/api/cabang/`, values)
            toast.dismiss()
            toast.success('Cabang updated')
            onClose()
            router.refresh()
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
                <div className='font-bold text-xl mb-5'>Tambah Cabang</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='nama'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama cabang</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama cabang ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='alamat'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat cabang</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Alamat cabang ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='nomorTelepon'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor cabang</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nomor cabang ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email cabang</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Email cabang ...'
                                            type='email'
                                            {...field}
                                        />
                                    </FormControl>
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

export default AddCabang
