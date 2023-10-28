'use client'

import * as React from 'react'
import {
    CaretSortIcon,
    CheckIcon,
    PlusCircledIcon
} from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useData } from '@/components/providers/data-provider'
import { LoaderIcon } from 'lucide-react'
import { useCabangStore } from '@/store/selectedCabang'
import { useRouter } from 'next/navigation'

const groups = [
    {
        label: 'Personal Account',
        cabangs: [
            {
                label: 'Alicia Koch',
                value: 'personal'
            }
        ]
    },
    {
        label: 'Cabangs',
        cabangs: [
            {
                label: 'Acme Inc.',
                value: 'acme-inc'
            },
            {
                label: 'Monsters Inc.',
                value: 'monsters'
            }
        ]
    }
]

type Cabang = (typeof groups)[number]['cabangs'][number]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SelectCabangProps extends PopoverTriggerProps {}

export default function SelectCabang({ className }: SelectCabangProps) {
    const [open, setOpen] = React.useState(false)
    const [myCabang, setMyCabang] = React.useState<
        [{ label: string; value: string }]
    >([
        {
            label: '',
            value: ''
        }
    ])
    const [showNewCabangDialog, setShowNewCabangDialog] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const userId = useData().userData?.id
    const currentCabang = {
        label: useCabangStore.getState().cabang?.nama!,
        value: useCabangStore.getState().cabang?.id!
    }
    const router = useRouter()
    const [selectedCabang, setSelectedCabang] =
        React.useState<Cabang>(currentCabang)

    const getMyCabang = async () => {
        try {
            const res = await axios.get(`/api/cabang-user/${userId}`)
            const cabang = res.data.map((item: any) => ({
                label: item.cabang.nama,
                value: item.cabang.id
            }))
            setMyCabang(cabang)
        } catch (error) {
            toast.error('Gagal mengambil data cabang')
        }
    }

    React.useEffect(() => {
        if (userId) {
            getMyCabang()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    React.useEffect(() => {
        if (!selectedCabang.value) {
            setSelectedCabang(currentCabang)
            console.debug('selected cabang', selectedCabang)
        }
        setIsLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useCabangStore.getState().cabang])

    const handleChangeCabang = (id: string) => {
        console.debug('selected cabang', id)
        localStorage.setItem('selectedCabang', id)
        
        window.location.href = '/'
    }

    return (
        <div className=''>
            {isLoading ? (
                <div className='animate-spin mr-2'>
                    <LoaderIcon />
                </div>
            ) : (
                <Dialog
                    open={showNewCabangDialog}
                    onOpenChange={setShowNewCabangDialog}>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={open}
                                aria-label='Select a cabang'
                                className={cn(
                                    'w-[200px] justify-between text-zinc-950',
                                    className
                                )}>
                                {selectedCabang.label}
                                <CaretSortIcon className='ml-auto h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[200px] p-0'>
                            <Command>
                                <CommandList>
                                    <CommandInput placeholder='Search Cabang...' />
                                    <CommandEmpty>
                                        No cabang found.
                                    </CommandEmpty>
                                    {myCabang.map(cabang => (
                                        <CommandItem
                                            key={cabang.value}
                                            onSelect={() => {
                                                setSelectedCabang(cabang)
                                                setOpen(false)
                                                handleChangeCabang(cabang.value)
                                            }}
                                            className='text-sm'>
                                            {cabang.label}
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    selectedCabang.value ===
                                                        cabang.value
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandList>
                                <CommandSeparator />
                            </Command>
                        </PopoverContent>
                    </Popover>
                </Dialog>
            )}
        </div>
    )
}
