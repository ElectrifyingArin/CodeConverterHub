import { motion } from "framer-motion";
import { useState, useEffect } from "react";

type Mascot = {
  name: string;
  svg: JSX.Element;
  color: string;
  message: string;
};

const mascots: Mascot[] = [
  {
    name: "PythonPal",
    color: "#3776AB",
    message: "Slithering through your code...",
    svg: (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20"
      >
        {/* Python snake mascot */}
        <motion.path
          d="M30,50 Q40,35 50,50 Q60,65 70,50"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        />
        <motion.circle
          cx="75"
          cy="45"
          r="5"
          fill="currentColor"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.2 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse", 
            ease: "easeInOut" 
          }}
        />
      </svg>
    ),
  },
  {
    name: "JavaScriptJuggler",
    color: "#F7DF1E",
    message: "Juggling your functions...",
    svg: (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20"
      >
        {/* JavaScript juggling balls */}
        <motion.circle
          cx="35"
          cy="50"
          r="8"
          fill="currentColor"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 30]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="currentColor"
          animate={{
            y: [0, -30, 0],
            x: [0, -15, -30]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            delay: 0.5
          }}
        />
        <motion.circle
          cx="65"
          cy="50"
          r="8"
          fill="currentColor"
          animate={{
            y: [-30, 0, -30],
            x: [-30, -15, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
      </svg>
    ),
  },
  {
    name: "SwiftSparrow",
    color: "#F05138",
    message: "Flying through your translation...",
    svg: (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20"
      >
        {/* Swift bird mascot */}
        <motion.path
          d="M20,50 C30,30 60,30 80,50 C60,70 30,70 20,50 Z"
          fill="currentColor"
          animate={{
            rotate: [0, 5, 0, -5, 0],
            y: [0, -3, 0, 3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="40"
          cy="45"
          r="3"
          fill="white"
          animate={{
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    ),
  },
  {
    name: "RustyRobot",
    color: "#CE412B",
    message: "Assembling your code bits...",
    svg: (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20"
      >
        {/* Rust gear robot */}
        <motion.path
          d="M35,30 L65,30 L65,70 L35,70 Z"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          animate={{
            rotate: [0, 1, 0, -1, 0],
            scale: [1, 1.05, 1, 0.95, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="45"
          cy="45"
          r="5"
          fill="currentColor"
          animate={{
            opacity: [1, 0.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="65"
          cy="45"
          r="5"
          fill="currentColor"
          animate={{
            opacity: [1, 0.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.path
          d="M45,60 L55,60"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            scaleX: [1, 1.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    ),
  },
  {
    name: "CodeCat",
    color: "#6E5494",
    message: "Purring through your syntax...",
    svg: (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-20 h-20"
      >
        {/* Cat mascot */}
        <motion.path
          d="M30,35 L40,25 L60,25 L70,35"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          animate={{
            y: [0, -2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="45"
          cy="45"
          r="4"
          fill="currentColor"
          animate={{
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="65"
          cy="45"
          r="4"
          fill="currentColor"
          animate={{
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        <motion.path
          d="M50,55 L50,65 M45,70 L55,70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            y: [0, 2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    ),
  },
];

export interface CodeLoadingProps {
  isLoading: boolean;
  text?: string;
}

export function CodeLoading({ isLoading, text }: CodeLoadingProps) {
  const [currentMascot, setCurrentMascot] = useState<Mascot>(mascots[0]);
  
  // Change mascot every few seconds
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mascots.length);
      setCurrentMascot(mascots[randomIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div 
          className="p-6 rounded-full mb-4" 
          style={{ color: currentMascot.color }}
        >
          {currentMascot.svg}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1 dark:text-white">
            {currentMascot.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {text || currentMascot.message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}