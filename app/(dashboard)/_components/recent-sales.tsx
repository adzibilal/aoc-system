import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { dateFormat, rupiahFormat } from '@/lib/utils'

interface RecentSalesProps {
    data: any[]
}

export function RecentSales({ data }: RecentSalesProps) {
    return (
        <div className='space-y-5'>
            {data.length === 0 && (
                <div className='text-center text-muted-foreground'>
                    No recent sales
                </div>
            )}
            {data.map((item, i) => (
                <div className='flex items-center' key={i}>
                    <div className='space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {item.namaPelanggan
                                ? item.namaPelanggan
                                : 'Tanpa Nama'}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            {dateFormat(item.tanggal)}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Kasir: {item.Pengguna.nama}
                        </p>
                    </div>
                    <div className='ml-auto font-medium flex flex-col gap-2 items-end'>
                        <Badge variant='outline'>
                            {item.status}
                        </Badge>
                        {rupiahFormat(
                            item.DetailPesanan.reduce((acc: any, curr: any) => {
                                return acc + curr.subtotal
                            }, 0)
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
