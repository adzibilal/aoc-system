export interface UserData {
    id: string
    username: string
    password: string
    role: string
    nama: string
    cabangId: string
}

export interface SessionData {
    user: UserData
    expDateTime: string
}

export interface Cabang {
    id: string
    nama: string
    alamat: string
    nomorTelepon: string
    email: string | null
}
export interface AnggotaCabang {
    id: string
    penggunaId: string
    cabangId: string
}
