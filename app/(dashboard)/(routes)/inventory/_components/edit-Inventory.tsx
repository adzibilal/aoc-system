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
import { on } from 'events'

interface EditInventoryProps {
    initialData: {
        id: string
        name: string
        cabangId: string
    }
    onClose: () => void
    onSuccess: () => void
}

const EditInventory = ({ onClose, onSuccess, initialData }: EditInventoryProps) => {
    const router = useRouter()

    const formSchema = z.object({
        name: z
            .string()
            .min(1, {
                message: 'Nama Inventory wajib di isi'
            })
            .max(50, {
                message: 'Nama Inventory maksimal 50 karakter'
            }),
        cabangId: z.string().min(1, {
            message: 'Cabang wajib di isi'
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...initialData
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.patch(`/api/inventory/${initialData.id}`, values)
            toast.dismiss()
            toast.success('Inventory diedit')
            onClose()
            onSuccess()
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
                <div className='font-bold text-xl mb-5'>Edit Inventory</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Barang</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama Barang ...'
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

export default EditInventory
