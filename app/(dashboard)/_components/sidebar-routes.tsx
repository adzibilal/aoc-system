'use client'

import {
    Layout,
    Compass,
    List,
    BarChart,
    Users,
    Coffee,
    Book,
    Calculator,
    ShoppingBasket,
    Store,
    Box
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { usePathname, useRouter } from 'next/navigation'

const guestRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/'
    },
    {
        icon: Store,
        label: 'Cabang',
        href: '/cabang'
    },
    {
        icon: Users,
        label: 'Pegawai',
        href: '/pegawai'
    },
    {
        icon: Coffee,
        label: 'Produk',
        href: '/produk'
    },
    {
        icon: Box,
        label: 'Kategori',
        href: '/kategori'
    },
    {
        icon: Calculator,
        label: 'Kasir',
        href: '/kasir'
    },
    {
        icon: ShoppingBasket,
        label: 'Bahan Baku',
        href: '/bahan-baku'
    }
]

const teacherRoutes = [
    {
        icon: List,
        label: 'Courses',
        href: '/teacher/courses'
    },
    {
        icon: BarChart,
        label: 'Analytics',
        href: '/teacher/analytics'
    }
]

export const SidebarRoutes = () => {
    const pathname = usePathname()

    const isTeacherPage = pathname?.includes('/teacher')

    const routes = isTeacherPage ? teacherRoutes : guestRoutes
    return (
        <div className='flex flex-col w-full'>
            {routes.map(route => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}
