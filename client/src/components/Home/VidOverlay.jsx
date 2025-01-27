import React from 'react';

const VidOverlay = () => {
  return (
    <div className="relative w-full h-screen mt-[-200px]">
      <div className="absolute bottom-0 left-0 right-0 z-0 bg-black bg-opacity-50 flex justify-center items-center pointer-events-auto">
        <video className="w-full max-w-[1200px] rounded-lg shadow-lg" controls>
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VidOverlay;
