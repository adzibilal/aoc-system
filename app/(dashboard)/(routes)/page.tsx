'use client'
import { NextPage } from 'next'

const DashboardPage: NextPage = () => {
    const session = localStorage.getItem("session");
    const { user } = JSON.parse(session || "{}");
    return (
        <div>
            <h1>Dashboard Page {user.username}</h1>
        </div>
    )
}

export default DashboardPage
