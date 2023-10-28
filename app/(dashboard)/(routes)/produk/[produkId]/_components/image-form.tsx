'use client'
import * as z from 'zod'
import axios from 'axios'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'

interface ImageFormProps {
    image?: string
    produkId: string
}

const formSchema = z.object({
    image: z.string().min(1, { message: 'Image is required' })
})

export const ImageForm = ({ image, produkId }: ImageFormProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => setIsEditing(current => !current)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // console.error(values)
            toast.loading('Loading...')
            await axios.patch(`/api/produk/${produkId}/updateImage`, values)
            toast.dismiss()
            toast.success('Produk updated')
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.dismiss()
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='mt-6 border bg-zinc-50 rounded-md p-4 max-md:w-full'>
            <div className='flex font-medium items-center justify-between'>
                Produk image
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !image && (
                        <>
                            <PlusCircle className='h-4 mr-2 w-4' />
                            Add an image
                        </>
                    )}
                    {!isEditing && image && (
                        <>
                            <Pencil className='h-4 mr-2 w-4' />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!image ? (
                    <div className='flex items-center justify-center h-60 max-md:w-full max-md:h-auto bg-slate-200 rounded-md aspect-video'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2 h-60 max-md:h-auto'>
                        <Image
                            alt='Upload'
                            fill
                            className='object-cover rounded-md'
                            src={image}
                        />
                    </div>
                ))}
            {isEditing && (
               <div className="">
                <FileUpload endpoint='produkImage' onChange={(url)=> {
                    if (url) {
                        onSubmit({image: url})
                    }
                }}/>
                <div className="text-xs text-muted-foreground mt-4 ">
                    16:9 aspect ratio recommended
                </div>
               </div>
            )}
        </div>
    )
}
