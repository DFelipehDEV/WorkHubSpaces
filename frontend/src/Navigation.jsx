// import { useState } from 'react'
import { Link } from "react-router";

function Navigation() {
    const baseUrl = import.meta.env.VITE_FRONTEND_URL;
    return (
        <div className="px-24 pt-5 sticky top-0">
            <div className="px-6 py-4 flex gap-8 justify-between rounded-4xl bg-white/75 backdrop-blur-sm border-2">
                <a href={baseUrl} className="text-stone-800 text-2xl font-semibold">Workhub Spaces</a>
                <div className="flex gap-8">
                    <Link to={baseUrl} className="text-stone-800 text-xl font-normal tracking-tighter">Home</Link>
                    <Link to={`${baseUrl}/spaces`} className="text-stone-800 text-xl font-normal tracking-tighter">Spaces</Link>
                    <Link to={`${baseUrl}/login`} className="bg-primary-2 text-center px-4 py-1 rounded-xl tracking-tighter text-white text-md font-normal">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Navigation
