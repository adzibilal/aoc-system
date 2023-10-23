'use client'
import React, {
    createContext,
    useContext,
    ReactNode,
    ReactElement,
    useState,
    useEffect
} from 'react'

import axios from 'axios'
import { SessionData, UserData } from '@/types'
import { Cabang } from '@prisma/client'

// Define the shape of your data (you can replace this with your own data structure)
type Data = {
    // Define your data structure here
    count: number
    increment: () => void
    detailCabang: Cabang | null
    userData: any
}

// Create a context with an initial value
const DataContext = createContext<Data | undefined>(undefined)

// Define the props for the DataProvider component
type DataProviderProps = {
    children: ReactNode
}

// DataProvider component
export function DataProvider({ children }: DataProviderProps): ReactElement {
    const [count, setCount] = useState(0)
    const [detailCabang, setDetailCabang] = useState(null)
    const [userData, setUserData] = useState<{
        id: string
        username: string
        role: string
        nama: string
    } | null>(null)

    const increment = () => {
        setCount(count + 1)
    }

    let session: string | null = null
    let cabangId: string | null = null
    if (
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined'
    ) {
        // Access localStorage here
        session = localStorage.getItem('session')
        cabangId = localStorage.getItem('selectedCabang')
        if (!session) {
            window.location.href = '/sign-in'
        }
    }

    const { user }: SessionData = JSON.parse(session || '{}')

    const getUserData = async () => {
        const userRes = await axios.get(`/api/pengguna/${user.id}`)
        return setUserData(userRes.data)
    }

    const fetchData = async () => {
        const result = await axios(`/api/cabang/${cabangId}`)
        setDetailCabang(result.data)
    }

    useEffect(() => {
        fetchData()
        getUserData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    // Create a data object to share through the context
    const data: Data = {
        count,
        increment,
        detailCabang,
        userData
    }

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}

// Custom hook to access the data from child components
export function useData(): Data {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
