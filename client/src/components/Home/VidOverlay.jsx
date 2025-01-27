import { useRef, useState } from "react";

const VidOverlay = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-screen mt-[-200px]">
      <div className="absolute bottom-0 left-0 right-0 z-0 bg-black bg-opacity-50 flex justify-center items-center pointer-events-auto">
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full max-w-[1200px] rounded-lg shadow-lg"
          onClick={handlePlay} // Allow video to play on click
        >
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>

        {/* Custom Play Button */}
        {!isPlaying && (
          <button
            className="absolute text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-4 focus:outline-none flex items-center justify-center"
            onClick={handlePlay}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-5.197-3.01A1 1 0 008 9.035v5.93a1 1 0 001.555.832l5.197-3.01a1 1 0 000-1.664z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VidOverlay;

