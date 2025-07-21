import React from 'react';
import One from '/src/assets/one.png';
import Two from '/src/assets/two.png';
import Grid from '/src/assets/Grid.png';
import Three from '/src/assets/Three.png';
import Four from '/src/assets/four.png';


const Feature = () => {
  return (
    <div className="w-full bg-[#1a1b23] py-16 sm:py-24 md:py-32 lg:py-[10rem] px-4 relative" style={{
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
      <div className="relative z-10">
        <div className="max-w-[700px] mx-auto text-center mb-8 sm:mb-16 md:mb-24 lg:mb-30 px-4">
          <h1 className="text-3xl font-[URW-bold] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white my-6 sm:my-8 md:my-10">
            Advanced{' '}
            <span className="text-transparent font-[URW-bold-italic] bg-gradient-to-r from-[#6E5DCD] via-purple-300 to-[#6E5DCD] bg-clip-text">
              functionality.
            </span>{' '}
            Flawless{' '}
            <div className="relative inline-block">
              <span className="text-transparent font-[URW-bold-italic] bg-gradient-to-r from-[#6E5DCD] via-purple-200 to-[#6E5DCD] bg-clip-text">
                integration
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
          <p className=" font-[futura] text-gray-400 text-base sm:text-lg md:text-xl px-4">
            Offering exceptional power paired with seamless compatibility for your workflow—delivering
            results without compromise.
          </p>
        </div>


        <div className="max-w-[1040px] mx-auto grid py-6 sm:py-8 md:py-10 text-white md:grid-cols-2 gap-8">
          <img className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto my-4 order-2 md:order-1" src={One} alt="/" />
          <div className="m-auto flex flex-col px-4 md:ml-20 justify-center order-1 md:order-2">
            <h1 className="font-[URW-bold] text-3xl sm:text-4xl md:text-5xl font-bold py-4 sm:py-6 md:py-10">1. Hide Inappropriate Messages</h1>
            <p className="font-[futura] text-sm sm:text-base">Harassing messages are hidden from the user while remaining stored for evidence. The harasser remains unaware, reducing the risk of retaliation and protecting the user from distress.</p>
          </div>
        </div>

        <div className="max-w-[1040px] mx-auto py-6 sm:py-8 md:py-10 grid text-white md:grid-cols-2 gap-8">
          <div className="m-auto flex flex-col px-4 md:ml-20 justify-center ">
            <h1 className="font-[URW-bold] text-3xl sm:text-4xl md:text-5xl font-bold py-2 sm:py-6 md:pb-10 md:pt-0">2. Hide User</h1>
            <p className="font-[futura] text-sm sm:text-base">Harassers believe their messages are delivered, but they never appear in the recipient’s inbox or DMs. This prevents further escalation as harassers could use multiple id's if blocked directly.</p>
          </div>
          <img className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto my-4" src={Four} alt="/" />
        </div>

        <div className="max-w-[1040px] mx-auto py-6 sm:py-8 md:py-10 grid text-white md:grid-cols-2 gap-8">
          <img className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] mx-auto my-4 order-2 md:order-1" src={Two} alt="/" />
          <div className="m-auto flex flex-col px-4 md:ml-20 justify-center order-1 md:order-2">
            <h1 className="font-[URW-bold] text-3xl sm:text-4xl md:text-5xl font-bold py-4 sm:py-6 md:py-10">3. Tag Harassers</h1>
            <p className="font-[futura] text-sm sm:text-base">Allows users to tag and track harassers, making it easier to identify repeat offenders. This feature helps in better reporting and taking action against persistent abuse.</p>
          </div>
        </div>

        <div className="max-w-[1040px] mx-auto py-6 sm:py-8 md:py-10 grid text-white md:grid-cols-2 gap-8">
          <div className="m-auto flex flex-col px-4 md:ml-20 justify-center  ">
            <h1 className="font-[URW-bold] text-3xl sm:text-4xl md:text-5xl font-bold py-4 sm:py-6 md:py-10">4. Generate Reports</h1>
            <p className="font-[futura] text-sm sm:text-base">Generates ready-to-send reports containing all necessary evidence, including screenshots and timestamps. These reports are formatted for submission to law enforcement or platform moderators.</p>
          </div>
          <img className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[400px] mx-auto my-4 order-1 md:order-2" src={Three} alt="/" />
        </div>
        {/*<div className="flex w-[350px] items-center justify-center mt-20 bg-black text-white px-4 py-2 mx-auto rounded-4xl border border-[#402E7F] p-2"
        style={{
          background: 'linear-gradient(0deg, rgba(37, 32, 66, 0.50) 0%, rgba(41, 41, 82, 0.50) 109.33%)',
          boxShadow: '0px 10px 26.2px 15px rgba(102, 61, 158, 0.21)',
          backdropFilter: 'blur(20px)'
        }}>
          <span>Product is still in</span>
          <span className="mx-2 bg-[#6E5DCD] text-white px-3 py-1.5 rounded-full">
            Testing
          </span>
          <span>phase.</span>
        </div>*/}
      </div>
    </div>
  );
};

export default Feature;

