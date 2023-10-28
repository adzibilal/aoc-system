'use client'
import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useData } from '@/components/providers/data-provider'
import axios from 'axios'
import { use, useEffect, useState } from 'react'
import { BahanBaku } from '@prisma/client'
import { set } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const BahanBakuPage = () => {
    const router = useRouter()
    const { detailCabang } = useData()
    const [cabangId, setCabangId] = useState('')
    const [mounted, setMounted] = useState(false)
    const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([])

    const getBahanBaku = async () => {
        if (cabangId) {
            const bahan = await axios.get(`/api/cabang/${cabangId}/bahan-baku`)
            return setBahanBaku(bahan.data)
        }
    }

    const generateReport = (bahanBaku: BahanBaku[], tipe: string): string => {
        const categories = {
            "Liquid": [],
            "Syrup": [],
            "Powder": [],
            "Coffee Beans": [],
            "Tea bag": [],
            "Other": [],
            "Display": []
        };
    
        // Categorize the items
        bahanBaku.forEach((item) => {
            // @ts-ignore
            if (item.kategori && categories[item.kategori]) {
                // @ts-ignore
                categories[item.kategori].push(item);
            }
        });

        let report = tipe === 'open' ? "Bismillah\nOpen\n\nStock Opname\n\n" : "Alhamdulillah\nClose\n\nStock Opname\n\n";

        for (const category in categories) {
            // @ts-ignore
            if (categories[category].length > 0) {
                report += `*${category}* :\n\n`;
                
                // @ts-ignore
                categories[category].forEach((item) => {
                    report += `- ${item.nama} : ${item.stok} ${item.satuan}\n`;
                });
    
                report += "\n";
            }
        }
    
        return report;
    };

    const handleReport = (tipe: string) => {
        const openReport = generateReport(bahanBaku, tipe);
    
        // Copy the openReport text to the clipboard
        navigator.clipboard.writeText(openReport)
          .then(() => {
            toast.success('Laporan berhasil di copy')
            console.log('Text copied to clipboard:', openReport);
            // You can show a success message or perform any other action here
          })
          .catch((error) => {
            toast.error('Laporan gagal di copy')
            console.error('Failed to copy text to clipboard:', error);
            // Handle the error here
          });
      };
    

    useEffect(() => {
        setCabangId(detailCabang?.id || '')
    }, [detailCabang])

    useEffect(() => {
        if (cabangId) getBahanBaku()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cabangId, router])

    return (
        <div className='p-6'>
            <div className='flex max-md:flex-col justify-between items-center'>
                <h1 className='text-2xl font-bold'>Data Bahan Baku</h1>
                <div className='flex gap-3 justify-between'>
                    <Button size='sm' onClick={()=> handleReport('open')}>Laporan Open</Button>
                    <Button size='sm' onClick={()=> handleReport('close')}>Laporan Closing</Button>
                </div>
            </div>
            {bahanBaku && (
                <DataTable
                    onDataChange={getBahanBaku}
                    columns={columns}
                    data={bahanBaku}
                    cabangId={detailCabang?.id}
                />
            )}
        </div>
    )
}

export default BahanBakuPage
