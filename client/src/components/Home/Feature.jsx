import { motion, useTransform, useScroll } from "framer-motion";
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

export default Feature;

