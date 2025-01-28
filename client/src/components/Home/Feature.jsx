{/*import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Feature = () => {
  return (
    <div className="bg-black">
      <div className="flex h-28 items-center justify-center">
       <span className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-white to-purple-600 bg-clip-text ">Features</span> 
      </div>
      <HorizontalScrollCards />
      
    </div>
  );
};

const HorizontalScrollCards = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-16">
          {cards.map((card) => {
            return <FeatureCard card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ card }) => {
  const cardStyle = card.isTransparent
    ? { background: 'transparent' }
    : {
        backgroundImage: `url('data:/assets/Group.svg/svg+xml;charset=utf-8,<svg xmlns="/assets/Group.png" viewBox="0 0 1 1"><rect width="1" height="1" fill="%23280137"/><rect width="1" height="1" fill="%23421C5F" style="mix-blend-mode:overlay"/></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#6B198B',
        position: 'relative',
      };

  return (
    <div
      className="group relative h-[400px] w-[375px] overflow-hidden rounded-xl"
      style={cardStyle}
    >
      {!card.isTransparent && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(113.84% 61.64% at 76.5% 54.97%, #0D0116 0%, #190F2F 29.05%, #3B2B5C 50%, #2D184D 61.74%, #31254D 72.67%, #190F2F 82.38%, #1A042B 100%)',
            mixBlendMode: 'overlay',
          }}
        />
      )}
      <div className="h-[40%] relative">
        <div
          style={{
            backgroundImage: `url(${card.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
        ></div>
      </div>
      <div className="p-6 h-[60%] relative text-center z-10">
        <h3 className="text-3xl font-bold mb-2 text-white">{card.title}</h3>
        <p className="text-white text-md font-Futura leading-relaxed">{card.description}</p>
      </div>
    </div>
  );
};

const cards = [
  {
    url: "",
    title: "",
    description: "",
    isTransparent: true,
    id: 0,
  },
  {
    url: "",
    title: "",
    description: "",
    isTransparent: true,
    id: 0.5,
  },
  {
    url: "/api/placeholder/400/320",
    title: "Auto Save Evidence",
    description:
      "Automatically captures and stores screenshots of harassment messages with timestamps and metadata. This ensures tamper-proof evidence that can be easily accessed for legal purposes without manual effort.",
    isTransparent: false,
    id: 1,
  },
  {
    url: "/api/placeholder/400/320",
    title: "Invisible Messages",
    description:
      "Harassing messages are hidden from the user while remaining stored for evidence. The harasser remains unaware, reducing the risk of retaliation and protecting the user from distress.",
    isTransparent: false,
    id: 2,
  },
  {
    url: "/api/placeholder/400/320",
    title: "Tag Harassers",
    description:
      "Allows users to tag and track harassers, making it easier to identify repeat offenders. This feature helps in better reporting and taking action against persistent abuse.",
    isTransparent: false,
    id: 3,
  },
  {
    url: "/api/placeholder/400/320",
    title: "Generate Reports",
    description:
      "Generates ready-to-send reports containing all necessary evidence, including screenshots and timestamps. These reports are formatted for submission to law enforcement or platform moderators.",
    isTransparent: false,
    id: 4,
  },
  {
    url: "/api/placeholder/400/320",
    title: "Cybercrime Integration",
    description:
      "Provides direct integration with cybercrime helplines for immediate assistance. Users can easily report incidents and receive guidance on the next steps for legal action.",
    isTransparent: false,
    id: 5,
  },
];

export default Feature;*/}

import React from 'react';
import Single from '/src/assets/single.png';
import Double from '/src/assets/double.png';
import Triple from '/src/assets/triple.png';
import Four from '/src/assets/four.png';
import Five from '/src/assets/five.png';

const Feature = () => {
  return (
    <div className="w-full bg-[#1a1b23] py-[10rem] px-4" style={{
      
      
      background: 'linear-gradient(179deg, #000 1.34%, #1A1B23 64.44%, #000 99.13%)',
      boxShadow: '0px 4px 24px -1px rgba(0, 0, 0, 0.20)',
      backdropFilter: 'blur(20px)'
    }}>
      <div className="max-w-[700px] mx-auto text-center mb-30">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Advanced <span className="text-purple-600">functionality.</span> Flawless{' '}
          <span className="text-purple-700">integration.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl">
           Offering exceptional power paired with seamless compatibility for your workflow—delivering results without compromise.
        </p>
      </div>

      <div className="max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8">
        
        <div className="w-full bg-[#24252d] border border-purple-900 shadow-lg flex flex-col rounded-xl my-4 p-6 hover:scale-105 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400"></div>
          <img
            className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 p-3"
            src={Single}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-white text-center py-6">Invisible DM Filtering</h2>
          <div className="text-center font-medium text-gray-400">
            <p className="py-3 mx-8 border-b border-gray-700 mt-8">
              Hides harassing messages while keeping evidence safe.
            </p>
            <p className="py-3 mx-8 border-b border-gray-700">Keeps you stress-free by filtering harmful content.</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-purple-400 mx-auto w-[200px] px-6 py-3 my-6 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
            Learn More
          </button>
        </div>

        
        <div className="w-full bg-gradient-to-b from-purple-600/10 to-transparent backdrop-blur-sm border border-purple-500/20 shadow-lg flex flex-col rounded-xl my-8 md:my-0 p-6 hover:scale-105 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400"></div>
          <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xs px-3 py-1 rounded-full">
            Popular
          </div>
          <img
            className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 p-3"
            src={Double}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-white text-center py-6">Evidence Generation</h2>
          <div className="text-center font-medium text-gray-300">
            <p className="py-3 mx-8 border-b border-gray-700/50 mt-8">Automatically generates reports for authorities.</p>
            <p className="py-3 mx-8 border-b border-gray-700/50">Ensures legal-grade documentation of incidents.</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-purple-400 mx-auto w-[200px] px-6 py-3 my-6 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
            Learn More
          </button>
        </div>

       
        <div className="w-full bg-[#24252d] border border-purple-900 shadow-lg flex flex-col rounded-xl my-4 p-6 hover:scale-105 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400"></div>
          <img
            className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 p-3"
            src={Triple}
            alt="/"
          />
          <h2 className="text-2xl font-bold text-white text-center py-6">Tagging Harassers</h2>
          <div className="text-center font-medium text-gray-400">
            <p className="py-3 mx-8 border-b border-gray-700 mt-8">Identifies and flags harassers for future reference.</p>
            <p className="py-3 mx-8 border-b border-gray-700">Maintains a detailed record of harassment instances.</p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-purple-400 mx-auto w-[200px] px-6 py-3 my-6 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
            Learn More
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto grid md:grid-cols-2 gap-8 mt-12">

          <div className="w-full bg-[#24252d] border border-purple-900 shadow-lg flex flex-col rounded-xl my-4 p-6 hover:scale-105 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400"></div>
            <img
              className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 p-3"
              src={Four}
              alt="/"
            />
            <h2 className="text-2xl font-bold text-white text-center py-6">
              Cybercrime Helpline
            </h2>
            <div className="text-center font-medium text-gray-400">
              <p className="py-3 mx-8 border-b border-gray-700 mt-8">
                Direct integration with cybercrime helpline services.
              </p>
              <p className="py-3 mx-8 border-b border-gray-700">
                Provides prompt support for victims of online abuse.
              </p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-400 mx-auto w-[200px] px-6 py-3 my-6 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
              Learn More
            </button>
          </div>


          <div className="w-full bg-[#24252d] border border-purple-900 shadow-lg flex flex-col rounded-xl my-4 p-6 hover:scale-105 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400"></div>
            <img
              className="w-16 h-16 mx-auto mt-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 p-3"
              src={Five}
              alt="/"
            />
            <h2 className="text-2xl font-bold text-white text-center py-6">
              Easy Reporting
            </h2>
            <div className="text-center font-medium text-gray-400">
              <p className="py-3 mx-8 border-b border-gray-700 mt-8">
                Simplifies the process of reporting harassment cases.
              </p>
              <p className="py-3 mx-8 border-b border-gray-700">
                Ensures clear and concise documentation for action.
              </p>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-purple-400 mx-auto w-[200px] px-6 py-3 my-6 rounded-lg text-white font-semibold hover:opacity-90 transition-all">
              Learn More
            </button>
          </div>
      </div>
    </div>
  );
};

export default Feature;

