import Spline from '@splinetool/react-spline';
import React from 'react';
import { ReactTyped } from "react-typed"
import Circle from '../../assets/Circle.png'

const Hero = () => {
    return (
        <div>
            <div className="relative w-full h-screen overflow-hidden z-0 ">

                <div className="absolute inset-0 flex flex-col mt-[-100px]  justify-center items-center z-5 text-center pointer-events-none">
                    <h1 className="md:text-7xl sd:text-5xl text-2xl py-7 text-white font-bold md:py-7">
                        Stay Safe Online, Hassle-Free.
                    </h1>
                    <div className="flex justify-center items-center">
                        <p className="md:text-2xl sd:text-2xl font-URW text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-white to-purple-600 bg-clip-text">
                            Hide harassment messages while securing evidence for legal actions. <br />
                            Stay
                            <ReactTyped
                                className="md:text-2xl sd:text-2xl text-xl text-white font-bold md:pl-2 pl-2"
                                strings={["safe!", "protected.", "secured!"]}
                                typeSpeed={90}
                                backSpeed={100}
                                loop
                            />
                        </p>
                    </div>
                    <button className="bg-purple-600 mx-auto w-[200px] py-3 my-6 mb-30 rounded-3xl text-white font-bold pointer-events-auto">
                        Install Now
                    </button>
                    <div className=' relative z-0 mt-10'>
                        <img className='w-24 ' src={Circle} alt="/" />
                    </div>
                </div>
                <div className="absolute top-[40%] left-0 right-0 z-0">
                    <Spline scene="https://prod.spline.design/Ql1hHdBoyb7KLnb6/scene.splinecode" />
                </div>
            </div>
        </div>
    );
};


export default Hero;


