import React from 'react'

import Grid from '/src/assets/Grid.png';
import { Crown } from 'lucide-react';

const Pricing = () => {
    return (
        <div
            className="min-h-screen w-full bg-[#1a1b23] relative flex items-center justify-center px-4 py-8 md:py-12 lg:py-16"
            style={{
                background: 'linear-gradient(179deg, #000 1.34%, #1A1B23 64.44%, #000 99.13%)',
                boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
                backdropFilter: 'blur(20px)'
            }}
        >
            <div
                className="absolute top-0 left-0 w-full h-full opacity-40"
                style={{
                    backgroundImage: `url(${Grid})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 0
                }}
            />
            <div className='relative z-10 w'>
                <div className="max-w-[700px] mx-auto text-center mb-4 sm:mb-10 md:mb-14 lg:mb-20 px-4">
                    <h1 className="text-3xl font-[URW-bold] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white my-6 sm:my-8 md:my-10">
                        Experience{' '}
                        <span className="text-transparent font-[URW-bold-italic] bg-gradient-to-r from-[#6E5DCD] via-purple-300 to-[#6E5DCD] bg-clip-text">
                            Premium
                        </span>{' '}
                        Safety{' '}
                        <div className="relative inline-block">
                            <span className="text-transparent font-[URW-bold-italic] bg-gradient-to-r from-[#6E5DCD] via-purple-200 to-[#6E5DCD] bg-clip-text">
                                Features.
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="323"
                                height="19"
                                viewBox="0 0 323 19"
                                fill="none"
                                className="absolute -bottom-6 left-4 w-full scale-75 sm:scale-90 md:scale-100"
                            >
                                <path
                                    d="M0.18987 18.0002C90.956 6.55323 282.295 -10.3784 321.523 13.4712"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                    </h1>
                    <p className="text-gray-400 font-[futura] text-base sm:text-lg md:text-xl px-4">
                        Unlock advanced security, priority support, and exclusive tools to safeguard your online experience.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-16 items-center justify-center pb-30" >
                    {/* Free Plan Card */}
                    <div className="w-full max-w-md rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105" style={{
                        borderRadius: '20.355px',
                        background: 'linear-gradient(152deg, #252426 -9.42%, #252426 33.5%, #343336 50.92%, #252426 66.63%, #252426 106.79%)',
                        boxShadow: '0px 3.257px 19.541px -0.814px rgba(0, 0, 0, 0.20)',
                        backdropFilter: 'blur(16.284381866455078px)'
                    }}>
                        <div className="h-full rounded-3xl py-8 px-4 flex flex-col">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Free Plan</h2>
                                <p className="text-gray-400 font-[futura]">Basic protection for light use</p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex justify-center">
                                    <span className="text-6xl font-bold text-white">$0</span>
                                </div>
                            </div>

                            <div className=" p-4 mb-8 text-center">
                                <button className="w-full py-4 font-[futura] font-medium text-lg text-white transition-transform duration-200 hover:scale-95 active:scale-90" style={{
                                    borderRadius: '8px',
                                    border: '0.1px rgba(217, 217, 217, 0.10)',
                                    background: 'rgba(217, 217, 217, 0.10)',
                                    boxShadow: '0px 4px 6.8px 0px rgba(0, 0, 0, 0.25)'
                                }}>
                                    Current plan
                                </button>
                            </div>

                            <div className="flex-1 space-y-2 ml-6 font-[futura]">
                                <div className="flex items-start">
                                    <span className="text-green-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Real-time LinkedIn message screening</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-green-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Basic message blocking</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-green-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">User blocking management</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-green-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Message history tracking</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Plan Card */}
                    <div className="w-full max-w-md transition-transform duration-300 hover:scale-105" style={{
                        borderRadius: '20.355px',
                        border: '1px solid #7647B8',
                        background: 'linear-gradient(151deg, #5F4E9C -8.14%, #392E65 24.97%, #2A204C 48.88%, #392E65 73.54%, #5F4E9C 106.62%)',
                        boxShadow: '0px 3.257px 19.541px -0.814px rgba(0, 0, 0, 0.20)',
                        backdropFilter: 'blur(16.284381866455078px)'
                    }}>
                        <div className="h-full rounded-3xl py-8 px-4 flex flex-col">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
                                    Premium Plan <Crown className="ml-2 h-5 w-5 text-yellow-400" />
                                </h2>
                                <p className="text-gray-400 font-[futura]">Advanced protection for high-risk users (women and influencers)</p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex justify-center items-baseline">
                                    <span className="text-6xl font-bold text-white">$2</span>
                                    <span className="ml-2 font-[futura] text-gray-400">per month</span>
                                </div>
                            </div>

                            <div className="p-4 mb-8 text-center">
                                <button className="w-full py-4 font-[futura] bg-black  font-medium text-lg text-white transition-transform duration-200 hover:scale-95 active:scale-90" style={{
                                    borderRadius: '8px',
                                    boxShadow: '0px 4px 6.8px 0px rgba(0, 0, 0, 0.25)'
                                }}>
                                    Upgrade plan
                                </button>
                            </div>

                            <div className="flex-1 space-y-2 ml-6 font-[futura]">
                                <div className="flex items-start">
                                    <span className="text-yellow-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Auto-save screenshot as evidence</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-yellow-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Access to view Top most hidden users</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-yellow-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Priority support and more tag value</span>
                                </div>
                                <div className="flex items-start">
                                    <span className="text-yellow-400 mr-2 mt-1">✓</span>
                                    <span className="text-white">Extended message storage history</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Pricing;