"use client";

import { useState, useEffect, useRef } from 'react';
import FileUploader from './FileUploader';

export default function Hero({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
    const [uploadedURL, setUploadedURL] = useState<string | null>(null);
    const orbitRef = useRef<HTMLDivElement>(null);

  
    useEffect(() => {
        setUploadedURL(uploadedURL);
        onUploadComplete(uploadedURL!); 
    }, [uploadedURL]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black">
            {/* Animated Background Gradient */}
            <div 
                ref={orbitRef}
                className="absolute translate-x-[5] translate-y-2 -left-1/4 -top-1/4 h-[150%] w-[150%] "
                style={{
                    background: `radial-gradient(circle at 30% 30%, #D62828 0%, transparent 90%)`,
                    opacity: 0.25,
                    filter: 'blur(100px)',
                }}
            />

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    {/* Header */}

                    <div className='mt-24 items-center justify-center z-50 px-4   
     flex py-2 
     bg-white/10 backdrop-blur-lg border border-white/20 
     shadow-xl rounded-full md:text-sm  text-[10px]'>
                        ⚡ Generate Tanglish Captions with AI
                    </div>


                    <h1 className="max-w-4xl  py-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-5xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                    {/* Reels ah kudunga<br />Captions ah edunga */}
                    Stop wasting hours <br /> captioning your reels
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl text-lg text-gray-400/60 sm:text-xl">
                        Get your tanglish captions in seconds. <br /> Available in .srt and .vtt format
                    </p>

                    {/* FileUploader Component */}
                    <div className="w-full mt-8 max-w-3xl">
                        <FileUploader onUploadComplete={(url) => setUploadedURL(url)} />
                    </div>

                </div>
            </div>
        </div>
    );
}
