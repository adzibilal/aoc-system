import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
interface DeleteCabangProps {
    cabangId?: string
}
const DeleteCabang = ({ cabangId }: DeleteCabangProps) => {
    const router = useRouter()

    const onSubmit = async () => {
        try {
            toast.loading('Loading...')
            await axios.delete(`/api/cabang/${cabangId}`)
            toast.dismiss()
            toast.success('Cabang deleted')
            router.push('/cabang')
            router.refresh()
        } catch (error) {
            toast.dismiss()
            toast.error('Cabang Ini Memiliki Anggota')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='destructive'>Delete Cabang</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Anda yakin ingin menghapus Cabang Ini?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='!p-0' onClick={onSubmit}>
                        <Button variant='destructive'>Delete Cabang</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCabang
