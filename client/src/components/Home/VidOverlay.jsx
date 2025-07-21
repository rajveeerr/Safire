import { useRef, useState } from "react";
// import image from '../../assets/image.png'

const videoSrc = "https://player.vimeo.com/video/1059493429?h=d627d7e6b2";

const VidOverlay = () => {
  const videoRef = useRef(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  // const handlePlay = () => {
  //   if (videoRef.current) {
  //     videoRef.current.play();
  //     setIsPlaying(true);
  //   }
  // };

  return (
    <div className="flex justify-center w-full">
    <div className="w-full max-w-[280px] sm:max-w-[480px] md:max-w-[768px] lg:max-w-[1200px] border p-2 rounded-lg shadow-lg">
  <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
    <iframe
      className="absolute  top-0 left-0 w-full h-full rounded-lg"
      title="Safire-Demo"
      src="https://player.vimeo.com/video/1059493429"
      allowFullScreen
    ></iframe>
  </div>
</div>
</div>
  );
};

export default VidOverlay;