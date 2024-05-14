import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, easeIn } from "framer-motion";
function Reveal({ children }) {
  return (
    <div className="relative">
      <motion.div
        initial={{
          opacity: 0.4,
          y: 115,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.4,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Reveal;
