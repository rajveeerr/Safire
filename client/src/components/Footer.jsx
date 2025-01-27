import React from 'react'
import { 
    FaFacebookSquare,
    FaTwitterSquare,
    FaGithubSquare,
    FaInstagram
} from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 text-gray-300 gap-20'>
            <div>
                <h1 className='w-full text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-white to-purple-600 bg-clip-text'>Harassment Saver</h1>
                <p className='py-4'>Harassment Saver is dedicated to protecting users from online harassment by offering privacy, support, and resources for legal action. Our goal is to make the internet a safer space for everyone.</p>
                <div className='flex justify-between md:w-[75%] my-6'>
                    <FaFacebookSquare size={30} />
                    <FaGithubSquare size={30} />
                    <FaInstagram size={30} />
                    <FaTwitterSquare size={30} />
                </div>
            </div>
            <div className='lg:col-span-2 flex justify-between mt-6'>
                <div className='w-full'>
                    <h1 className='font-medium text-gray-500'>Quick Links</h1>
                    <ul>
                        <li className='py-2 text-sm'>About Us</li>
                        <li className='py-2 text-sm'>Contact</li>
                        <li className='py-2 text-sm'>Privacy Policy</li>
                        <li className='py-2 text-sm'>Terms of Service</li>
                        <li className='py-2 text-sm'>FAQ</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer;
