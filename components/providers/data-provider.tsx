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

// Define the shape of your data (you can replace this with your own data structure)
type Data = {
    // Define your data structure here
    count: number
    increment: () => void
    detailCabang: any
    user: UserData
}

// Create a context with an initial value
const DataContext = createContext<Data | undefined>(undefined)

// Define the props for the DataProvider component
type DataProviderProps = {
    children: ReactNode
}

// DataProvider component
export function DataProvider({ children }: DataProviderProps): ReactElement {
    const session: string | null = localStorage.getItem('session')
    if (!session) {
        window.location.href = '/sign-in'
    }
    const [count, setCount] = useState(0)
    const [detailCabang, setDetailCabang] = useState(null)
    const cabangId = localStorage.getItem('selectedCabang')
    const increment = () => {
        setCount(count + 1)
    }
   
    const { user }: SessionData = JSON.parse(session || '{}')

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(`/api/cabang/${cabangId}`)
            setDetailCabang(result.data)
        }
        fetchData()
    }, [cabangId])

    // Create a data object to share through the context
    const data: Data = {
        count,
        increment,
        detailCabang,
        user
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
