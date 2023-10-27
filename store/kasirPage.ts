import axios from 'axios'
import create from 'zustand'

interface ProdukKasirProps {
    id: string
    nama: string
    deskripsi: string | null
    harga: number
    image: string | null
    cabangId: string
    kategoriProdukId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    kategori: {
        id: string
        nama: string
        createdAt: Date | null
        updatedAt: Date | null
    } | null
}

interface itemCart {
    item: ProdukKasirProps
    qty: number
}

// Define the store state
interface KasirStoreState {
    cabangId: string
    isChart: boolean
    produk: ProdukKasirProps[]
    itemCart: itemCart[]
}

// Define the store actions
interface KasirStoreActions {
    setCabangId: (cabangId: string) => void
    setIsChart: (isChart: boolean) => void
    setProduk: (produk: ProdukKasirProps[]) => void
    setItemCart: (itemCart: itemCart[]) => void
    updateCart: (itemWithQty: itemCart) => void
    getProduk: () => Promise<void>
    incrementItemQty: (itemId: string) => void
    decrementItemQty: (itemId: string) => void
}

// Create the store
const useKasirStore = create<KasirStoreState & KasirStoreActions>(
    (set, get) => {
        return {
            cabangId: '',
            isChart: false,
            produk: [],
            itemCart: [],

            setCabangId: cabangId => set({ cabangId }),
            setIsChart: isChart => set({ isChart }),
            setProduk: produk => set({ produk }),
            setItemCart: itemCart => set({ itemCart }),

            updateCart: itemWithQty =>
                set(state => {
                    const newCart = [...state.itemCart]
                    const existingItem = newCart.find(
                        item => item.item.id === itemWithQty.item.id
                    )

                    if (existingItem) {
                        existingItem.qty = itemWithQty.qty
                        if (existingItem.qty === 0) {
                            const index = newCart.indexOf(existingItem)
                            newCart.splice(index, 1)
                        }
                    } else {
                        newCart.push(itemWithQty)
                    }

                    return { itemCart: newCart, isChart: true }
                }),

            getProduk: async () => {
                const state = get()
                if (state.cabangId) {
                    try {
                        const response = await axios.get(
                            `/api/kasir/${state.cabangId}/produk`
                        )
                        set({ produk: response.data })
                    } catch (error) {
                        // Handle the error here
                        console.error(error)
                    }
                }
            },

            incrementItemQty: (itemId: string) =>
                set(state => {
                    const newCart = [...state.itemCart]
                    const existingItem = newCart.find(
                        item => item.item.id === itemId
                    )

                    if (existingItem) {
                        existingItem.qty += 1
                    }

                    return { itemCart: newCart }
                }),

            decrementItemQty: (itemId: string) =>
                set(state => {
                    const newCart = [...state.itemCart]
                    const existingItem = newCart.find(
                        item => item.item.id === itemId
                    )

                    if (existingItem) {
                        existingItem.qty -= 1
                        if (existingItem.qty === 0) {
                            const index = newCart.indexOf(existingItem)
                            newCart.splice(index, 1)
                        }
                    }

                    return { itemCart: newCart }
                })
        }
    }
)

export default useKasirStore
