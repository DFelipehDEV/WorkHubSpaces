// import { useState } from 'react'
import Navigation from "./Navigation"
import Footer from "./Footer"

function Home() {
    return (
        <body>
            <Navigation/>
            <div className="px-16 lg:px-48">
                <h1>Bemvindo</h1>
            </div>
            <Footer/>
        </body>
    )
}

export default Home
