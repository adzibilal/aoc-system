import create from 'zustand';

type Cabang = {
    id: string;
    nama: string;
    alamat: string;
    nomorTelepon: string;
    email: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};

type CabangStore = {
    cabang: Cabang | null;
    setCabang: (cabang: Cabang) => void;
    clearCabang: () => void;
};

export const useCabangStore = create<CabangStore>((set) => ({
    cabang: null,
    setCabang: (cabang) => set({ cabang }),
    clearCabang: () => set({ cabang: null }),
}));
