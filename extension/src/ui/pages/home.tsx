import React, { useState } from 'react';
import { Settings2, Share2, Wand2 } from 'lucide-react';

export default function HomePage(){
    const [padding, setPadding] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    });

    return (
        <div className="plasmo-p-4">
            <div className="plasmo-mb-6">
                <div className='plasmo-flex plasmo-justify-center plasmo-flex-col plasmo-items-center plasmo-text-center'>
                    <h1 className="plasmo-text-4xl plasmo-mb-2 plasmo-font-serif">
                        Welcome to <span className="plasmo-text-blue-500 plasmo-font-serif">SavEr</span>
                    </h1>
                    <p className="plasmo-text-gray-400 plasmo-text-xs plasmo-mb-4">
                    We'll fight your harassers while you browse your favorite websites
                    </p>
                    
                    <div className="plasmo-bg-gray-800 plasmo-rounded-lg plasmo-p-4 plasmo-mb-6">
                        <div className="plasmo-aspect-video plasmo-bg-gray-700 plasmo-rounded-md plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mb-4">
                            <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-900 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-hover:bg-gray-800 plasmo-transition-colors">
                                <span className="plasmo-text-lg">▶</span>
                                Watch the walkthrough video
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


