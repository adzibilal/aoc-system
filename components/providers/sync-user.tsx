'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SyncUser() {
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem("session");
        if (!session) {
            router.push("/sign-in");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

