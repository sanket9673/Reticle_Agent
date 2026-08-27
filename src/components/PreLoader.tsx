import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PreLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000); // Auto-hide after 2s
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ clipPath: "circle(100% at 50% 50%)", opacity: 1 }}
      animate={loaded ? { clipPath: "circle(0% at 50% 50%)", opacity: 0 } : {}}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] bg-[#d0ff8e] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-black text-3xl md:text-7xl font-bold tracking-wide text-center px-6 md:px-12 leading-relaxed"
      >
        Transforming impactful   
        <br className="hidden md:block" />  
        Ideas into Seamless  
        <br className="hidden md:block" />  
        User Experiences
      </motion.div>
    </motion.div>
  );
};

export default PreLoader;
