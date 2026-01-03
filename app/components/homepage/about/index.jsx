"use client";
// @flow strict

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

function AboutSection() {
  const photos = [
    personalData.profile,
    "/image/professional1.png",
    "/image/brothers.png",
    "/image/professional2.png",
    "/image/swag.png",
    "/image/ethiocuz1.png",
  ];

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % photos.length);
      }, 2000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [photos.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Function to get the appropriate scale for each image
  const getImageScale = (index, isActive) => {
    const isFirstOrLast = index === 0 || index === photos.length - 1;
    
    if (isActive) {
      return isFirstOrLast ? 'scale-110' : 'scale-100';
    } else {
      return isFirstOrLast ? 'scale-100' : 'scale-90';
    }
  };

  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 -right-8 z-30">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md shadow-lg">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who I am?
          </p>
          <p className="text-gray-200 text-sm lg:text-lg whitespace-pre-line">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2">
          <div className="relative">
            {/* Carousel Container - made larger */}
            <div 
              className="w-[600px] h-[450px] overflow-hidden rounded-lg relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Sliding Images Container */}
              <div 
                className="flex transition-transform duration-700 ease-in-out h-full items-center"
                style={{
                  transform: `translateX(-${currentPhoto * 320}px)`,
                  width: `${photos.length * 320}px`,
                  marginLeft: '140px' // Adjusted for better centering
                }}
              >
                {photos.map((photo, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-[320px] h-full relative mx-2 flex items-center justify-center"
                  >
                    <Image
                      src={photo}
                      width={300} // Increased from 280
                      height={420} // Increased from 380
                      alt={`Photo ${index + 1}`}
                      className={`rounded-lg object-contain cursor-pointer transition-all duration-700 max-h-full max-w-full ${
                        index !== currentPhoto 
                          ? `opacity-40 ${getImageScale(index, false)}` 
                          : `opacity-100 ${getImageScale(index, true)} hover:scale-125`
                      }`}
                      onClick={() => setCurrentPhoto(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Side gradients for depth effect */}
              <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-[#0d1224] via-[#0d1224]/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-[#0d1224] via-[#0d1224]/20 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;