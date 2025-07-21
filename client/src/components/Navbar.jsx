import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Safire from "/src/assets/Safire.svg"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full md:w-[1000px] mx-auto py-2 px-4 md:px-6 sticky top-2 z-10">
      <div className="max-w-7xl font-[futura] mx-auto rounded-4xl border border-[#3b3174] p-2"
           style={{
             background: 'linear-gradient(0deg, rgba(37, 32, 66, 0.50) 0%, rgba(41, 41, 82, 0.50) 109.33%)',
             boxShadow: '0px 10px 26.2px 15px rgba(102, 61, 158, 0.21)',
             backdropFilter: 'blur(20px)'
           }}>
        <div className="flex items-center justify-between">
          
          <div>
            <img className='py-1 mx-4' src={Safire} alt="/" />
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <a href="/" className="text-white hover:text-[#6E5DCD] transition-colors">
              Home
            </a>
            <a href="/how-it-works" className="text-white hover:text-[#6E5DCD] transition-colors">
              How it works
            </a>
            <a href="/features" className="text-white hover:text-[#6E5DCD] transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-white hover:text-[#6E5DCD] transition-colors">
              Premium
            </a>
          </div>

          {/* Desktop Sign In */}
          <div className="hidden md:block">
            <a href="https://safe-dm-dashboard.vercel.app/signin" className="bg-[#6E5DCD] text-white font-bold px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
              Sign in
            </a>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 md:hidden bg-[#252042] border border-[#4d3f95] rounded-lg">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-white hover:text-purple-400 transition-colors">
                  Home
                </a>
                <a href="/how-it-works" className="text-white hover:text-[#6E5DCD] transition-colors">
                  How it works
                </a>
                <a href="/features" className="text-white hover:text-[#6E5DCD] transition-colors">
                  Features
                </a>
                <a href="/pricing" className="text-white hover:text-[#6E5DCD] transition-colors">
                  Pricing
                </a>
                <a href="https://safe-dm-dashboard.vercel.app/signin" className="bg-[#6E5DCD] text-white px-6 py-2 rounded-full hover:bg-[#6E5DCD] transition-colors text-center">
                  Sign in
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;