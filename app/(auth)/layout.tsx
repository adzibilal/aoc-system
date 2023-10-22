import Image from "next/image"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-screen flex items-center justify-center flex-col'>
            <Image src='/logo-white.png' width={200} height={100} alt="" className="invert"/>
            {children}
        </div>
    )
}

export default AuthLayout
