import { useState, useEffect } from 'react'
import Navigation from "./Navigation"
import Footer from "./Footer"

function Spaces() {
    const [spaces, setSpaces] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/spaces`)
            .then((res) => res.json())
            .then((json) => {
                setSpaces(json);
            })
            .catch(error => console.error(error));
    }, []); 

    console.log(spaces);
    return (
        <body>
            <Navigation/>
            <div className='px-16 lg:px-48 py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {spaces.map((space) => (
                        <a href='#' key={space.id} className='border border-stone-700 rounded-lg shadow-md overflow-hidden bg-white'>
                            <img 
                                src={space.images[0]} 
                                alt={space.name} 
                                className='w-full h-48 object-cover'
                            />
                            <div className='flex justify-between p-4'>
                                <div className='leading-2'>
                                    <h3 className='font-semibold text-lg text-stone-800'>{space.name}</h3>
                                    <h4 className=' font-light text-stone-600'>asasa</h4>
                                </div>
                                <button className='bg-primary-2 rounded-xl px-3 text-white shadow-md'>Book</button>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <Footer/>
        </body>
    );
}

export default Spaces;
