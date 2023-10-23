'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncUser() {
    const router = useRouter()

    useEffect(() => {
        let session: string | null = null
        if (
            typeof window !== 'undefined' &&
            typeof window.localStorage !== 'undefined'
        ) {
            session = localStorage.getItem('session')
            if (!session) {
                window.location.href = '/sign-in'
            } else {
                const { expDateTime } = JSON.parse(session)
                const now = new Date()
                if (now > new Date(expDateTime)) {
                    localStorage.removeItem('session')
                    router.push('/sign-in')
                }
            }
        }
    }, [router])

    return null
}
