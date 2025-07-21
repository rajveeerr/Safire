import Spline from '@splinetool/react-spline';
import React from 'react';
import { ReactTyped } from "react-typed"
import Circle from '../../assets/Circle.png'
import Grid from '/src/assets/Grid.png';
import { 
    FaChrome,
} from 'react-icons/fa'

const Hero = () => {
    return (
        <div>
            <div className="w-full bg-[#1a1b23] py-6 sm:py-4 md:py-32 lg:py-[2rem] px-4 relative" style={{
                  background: 'linear-gradient(179deg, #000 1.34%, #1A1B23 64.44%, #000 99.13%)',
                  boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage: `url(${Grid})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      zIndex: 0
                    }}
                  />
            <div className="relative lg:h-screen h-[70vh] overflow-hidden z-0">
                
                <div className="absolute w-full flex flex-col mt-15 justify-center items-center z-5 text-center pointer-events-none">
                    
                    <h1 className="font-[URW-bold] text-5xl sm:text-4xl md:text-6xl lg:text-7xl pt-10 sm:pt-10 md:py-6 lg:py-7 text-white font-bold">
                        Stay Safe Online,{' '}
                        <div className="relative inline-block">
                            <span className="font-[URW-bold-italic] text-transparent bg-gradient-to-r from-[#6E5DCD] via-purple-300 to-[#6E5DCD] bg-clip-text">
                                Hassle-Free.
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="323"
                                height="19"
                                viewBox="0 0 323 19"
                                fill="none"
                                className="absolute -bottom-6 left-10 w-full scale-75 sm:scale-90 md:scale-100"
                            >
                                <path
                                    d="M0.18987 18.0002C90.956 6.55323 282.295 -10.3784 321.523 13.4712"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    </h1>
                    
                    <div className="flex justify-center items-center px-4 sm:px-6 md:px-8 pt-12 sm:pt-0">
                        <p className="font-[futura] bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl font-URW mb-5" style={{
                            backgroundImage:
                            'linear-gradient(89deg, #815CF2 0.62%, #C2A6E8 16.57%, #FFF 52.45%, #C2A6E8 88.67%, #815CF2 97.4%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                            Hide harassment messages while securing evidence for legal actions. <br className="hidden sm:block" />
                            Stay
                            <ReactTyped
                                className="text-lg sm:text-xl md:text-2xl text-white font-bold pl-2"
                                strings={["safe!", "protected.", "secured!"]}
                                typeSpeed={90}
                                backSpeed={100}
                                loop
                            />
                        </p>
                    </div>
                    <button className="bg-[#6E5DCD] font-[futura] transition-transform duration-200 hover:scale-95 active:scale-90 mx-auto w-[200px] gap-2 sm:w-[250px] justify-center flex items-center py-2 sm:py-3 my-4 sm:my-5 md:my-5 rounded-3xl text-white font-bold pointer-events-auto text-sm sm:text-base md:text-lg">
                    <FaChrome size={25}/>Install Web Extension
                    </button>
                    <div className=" mt-6 sm:mt-8 md:mt-10">
                        <img className="w-16 mt-8 sm:mt-8 md:mt-10 sm:w-20 md:w-24" src={Circle} alt="/" />
                    </div>
                </div>
                <div className="absolute top-[40%] left-0 right-0 z-0 hidden lg:block">
                    <Spline scene="https://prod.spline.design/Ql1hHdBoyb7KLnb6/scene.splinecode" />
                </div>
            </div>
        </div>
        </div>
    );
};

export default Hero;