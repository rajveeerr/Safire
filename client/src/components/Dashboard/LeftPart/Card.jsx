import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Clock, UserX, Flag, Camera, ArrowUp } from "lucide-react";

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Shield":
        return <Shield size={24} className="mt-1" />;
      case "Clock":
        return <Clock size={24} className="mt-1" />;
      case "UserX":
        return <UserX size={24} className="mt-1" />;
      case "Flag":
        return <Flag size={24} className="mt-1" />;
      case "Camera":
        return <Camera size={24} className="mt-1" />;
      default:
        return null;
    }
  };

  const leftCards = [
    {
      id: "blocked",
      title: "Total Blocked Messages",
      value: 35,
      icon: "Shield",
      color: "bg-[#B2CF9A]",
      textColor: "text-black",
      trend: "+12% from last week",
      detail: "Protecting you from unwanted content",
      img: ""
    },
    {
      id: "screenshots",
      title: "Saved Screenshots",
      value: 15,
      icon: "Camera",
      color: "bg-[#B4AA94]",
      textColor: "text-black",
      trend: "+5 this week",
      detail: "Evidence safely stored"
    }
  ];

  const centerCards = [
    {
      id: "time",
      title: "Total Minutes Saved",
      value: 100,
      icon: "Clock",
      color: "bg-[#354F4A]",
      textColor: "text-white",
      trend: "≈ 1.7 hours",
      detail: "Time better spent elsewhere"
    }
  ];

  const rightCards = [
    {
      id: "users",
      title: "Total Hidden Users",
      value: 10,
      icon: "UserX",
      color: "bg-[#7E9F87]",
      textColor: "text-black",
      trend: "+2 this week",
      detail: "Maintaining your peace of mind"
    },
    {
      id: "reports",
      title: "Total Reports",
      value: 2,
      icon: "Flag",
      color: "bg-[#36353B]",
      textColor: "text-white",
      trend: "All resolved",
      detail: "Quick action taken"
    }
  ];

  const cardVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const numberVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  };

  const renderCard = (card) => (
    <motion.div
      key={card.id}
      className={`${card.color} rounded-3xl p-6 overflow-hidden cursor-pointer ${card.textColor} mb-4 w-full`}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setHoveredCard(card.id)}
      onHoverEnd={() => setHoveredCard(null)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-xl font-semibold mb-2">{card.title}</div>
          <motion.div 
            className="text-3xl font-bold"
            variants={numberVariants}
            initial="initial"
            animate="animate"
          >
            {card.value}
          </motion.div>
        </div>
        {renderIcon(card.icon)}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredCard === card.id ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-sm"
      >
        <div className="flex items-center gap-1 mb-1">
          <ArrowUp size={16} />
          {card.trend}
        </div>
        <div>{card.detail}</div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-800 to-blue-900 p-20">
      <div className=" flex gap-6">
        {/* Left column */}
        <div className="w-3/5 flex flex-col mt-20">
          {leftCards.map(renderCard)}
        </div>

        {/* Center column */}
        <div className="w-3/4 flex flex-col">
          {centerCards.map(renderCard)}
          <motion.div
            className="bg-blue-600 rounded-3xl p-6 text-white mt-4"
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">VISA</span>
              <span>Debit Card</span>
            </div>
            <div className="text-3xl font-bold mb-4">$ 22,428.26</div>
            <div className="flex justify-between">
              <span>**** 9090</span>
              <span>04/24</span>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-3xl p-6 mt-4"
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
          >
            <div className="text-gray-500 mb-2">Weekly Revenue</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">+2,332 USD</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">+12%</span>
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="w-3/5 flex flex-col mt-20">
          {rightCards.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;