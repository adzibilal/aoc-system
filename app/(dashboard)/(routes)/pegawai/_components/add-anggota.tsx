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
import md5 from 'md5'

interface AddAnggotaProps {
    onClose: () => void
}

const AddAnggota = ({ onClose }: AddAnggotaProps) => {
    const router = useRouter()

    const formSchema = z.object({
        nama: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
        role: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: '',
            username: '',
            password: '',
            role: ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            await axios.post(`/api/pengguna/`, {
                ...values,
                password: md5(values.password)
            })
            toast.success('Pengguna ditambahkan')
            onClose()
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <>
            <div
                className='z-40 bg-black/40 w-screen h-screen fixed top-0 left-0'
                onClick={onClose}></div>
            <div className='z-50 bg-white p-5 rounded-md top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fixed w-[90%] max-w-[500px]'>
                <div className='font-bold text-xl mb-5'>Tambah Pengguna</div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='nama'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Pengguna</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Nama pengguna ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Username ...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder='Password ...'
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={[
                                                {
                                                    value: 'admin',
                                                    label: 'Admin'
                                                },
                                                {
                                                    value: 'staff',
                                                    label: 'Staff'
                                                }
                                            ]}
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

export default AddAnggota
