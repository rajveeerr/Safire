import React from 'react'
import { 
    FaFacebookSquare,
    FaTwitterSquare,
    FaGithubSquare,
    FaInstagram
} from 'react-icons/fa'

const Footer = () => {
    return (
      <footer className="w-full px-8 py-6" style={{
        borderRadius: '35px 35px 0px 0px',
        border: '1px solid #7210FA',
        background: 'linear-gradient(0deg, #241E41 0%, #0F0F15 109.33%)',
        boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-6xl mx-auto flex pt-8 flex-wrap justify-between items-start gap-8">
          
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-purple-500 text-2xl font-bold">LOGO</h2>
            <p className="text-gray-300">
              Harassment Saver protects users from online harassment by ensuring privacy,
              support, and legal resources, making the internet safer for all.
            </p>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-purple-600 font-semibold">Explore</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="/Hero.jsx" className="text-gray-300 hover:text-purple-500">Home</a></li>
              <li><a href="/demo" className="text-gray-300 hover:text-purple-500">Demo</a></li>
              <li><a href="/features" className="text-gray-300 hover:text-purple-500">Features</a></li>
            </ul>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-purple-600 font-semibold">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li><a href="https://github.com" className="text-gray-300 hover:text-purple-600">Github</a></li>
              <li><a href="https://linkedin.com" className="text-gray-300 hover:text-purple-600">Linkedin</a></li>
              <li><a href="/explore" className="text-gray-300 hover:text-purple-600">Explore</a></li>
              <li><a href="/explore" className="text-gray-300 hover:text-purple-600">Explore</a></li>
            </ul>
          </div>
  
          
          <div className="flex flex-col gap-4">
            <h3 className="text-purple-500 font-semibold">Links</h3>
            <ul className="flex flex-col text-gray-300 gap-2">
              <li><FaFacebookSquare size={30}/></li>
              <li><FaGithubSquare size={30}/></li>
              <li><FaInstagram size={30}/></li>
              <li><FaTwitterSquare size={30}/></li>
            </ul>
          </div>
        </div>
  
        
        <div className="mt-8 text-gray-400 max-w-6xl flex m-auto text-sm">
          Copyright @SafeDM 2025
        </div>
      </footer>
    );
  };

export default Footer;
