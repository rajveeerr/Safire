import React, {useState} from 'react'
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'

const Navbar = () => {
    const [nav, setNav] = useState(false)
    const handleNav = () =>{
        setNav(!nav)
    }

    return (
        <div className='relative z-20 flex justify-between items-center h-24 max-w-[1240px] m-auto px-4 text-white'>

            <h1 className='w-[450px] text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-white to-purple-600 bg-clip-text'>LOGO</h1>
            <ul className='hidden md:flex font-extralight'>
                <li className='p-4  hover:text-transparent bg-gradient-to-r from-white to-purple-600 bg-clip-text hover:font-bold'>Home</li>
                <li className='p-4  hover:text-transparent bg-gradient-to-r from-white to-purple-600 bg-clip-text hover:font-bold'>How it works</li>
                <li className='p-4  hover:text-transparent bg-gradient-to-r from-white to-purple-600 bg-clip-text hover:font-bold'>Features</li>
                <li className='p-4  hover:text-transparent bg-gradient-to-r from-white to-purple-600 bg-clip-text hover:font-bold'>Privacy Policy</li>
                <li className='p-4  hover:text-transparent bg-gradient-to-r from-white to-purple-600 bg-clip-text hover:font-bold'>About</li>
                
            </ul>
            <button className='bg-purple-700 mx-6 w-[150px] py-2 my-2 rounded-md text-white font-bold'>Install Extn.</button>
            <div onClick={handleNav} className=' block md:hidden'>
                {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>}
                
            </div>
            <div className={!nav ? 'fixed left-0 top-0 h-full border-r border-r-gray-500 bg-[#000300] ease-in-out duration-500 md:hidden' : ' fixed left-[-100%]'}>
                <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>Navbar</h1>
                <ul className='uppercase p-4'>
                    <li className='p-4 border-b border-gray-600'>Home</li>
                    <li className='p-4 border-b border-gray-600'>Company</li>
                    <li className='p-4 border-b border-gray-600'>Resource</li>
                    <li className='p-4 border-b border-gray-600'>About</li>
                    <li className='p-4'>Contact</li>
                </ul>
            </div>
        </div>
    )
}
export default Navbar