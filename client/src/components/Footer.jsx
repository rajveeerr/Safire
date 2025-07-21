import React from 'react'
import { 
    FaFacebookSquare,
    FaTwitterSquare,
    FaGithubSquare,
    FaInstagram
} from 'react-icons/fa'
import Safire from "/src/assets/Safire.svg"

const Footer = () => {
    return (
      <footer className="w-full px-8 py-6" style={{
        borderRadius: '35px 35px 0px 0px',
        border: '1px solid #6E5DCD',
        background: 'linear-gradient(0deg, #241E41 0%, #0F0F15 109.33%)',
        boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="font-[futura] max-w-6xl mx-auto flex pt-8 flex-wrap justify-between items-start gap-8">
          
          <div className="flex flex-col gap-4 max-w-sm">
            <div>
                        <img className='py-1 ' src={Safire} alt="/" />
                      </div>
            <p className="text-gray-300">
              Safire protects users from online harassment by ensuring privacy,
              support, and legal resources, making the internet safer for all.
            </p>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[#6E5DCD] font-semibold">Explore</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="/" className="text-gray-300 hover:text-purple-500">Home</a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-purple-500">Demo</a></li>
              <li><a href="/features" className="text-gray-300 hover:text-purple-500">Features</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-purple-500">Premium</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-purple-500">T & C</a></li>
            </ul>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[#6E5DCD] font-semibold">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="https://github.com/divyansharma001/Harrashment-Saver-Project1" className="text-gray-300 hover:text-[#6E5DCD]">Github</a></li>
              <li><a href="https://linkedin.com" className="text-gray-300 hover:text-[#6E5DCD]">Help</a></li>
              
            </ul>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[#6E5DCD] font-semibold">Links</h3>
            <ul className="flex flex-col text-gray-300 gap-2">
              <li><a href="https://github.com/divyansharma001/Harrashment-Saver-Project1"><FaGithubSquare size={30}/></a></li>
            </ul>
          </div>
        </div>
  
        
        <div className=" font-[futura] mt-8 text-gray-400 max-w-6xl flex m-auto text-sm">
          Copyright @Safire 2025
        </div>
      </footer>
    );
  };

export default Footer;
