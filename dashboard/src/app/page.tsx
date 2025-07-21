"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      router.push("/dashboard/profile");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return (
    <motion.div
      className="flex justify-center items-center text-center h-screen text-lg font-semibold"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      Redirecting...
    </motion.div>
  );
};

export default Home;
