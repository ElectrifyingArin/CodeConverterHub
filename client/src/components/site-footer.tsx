import { motion } from "framer-motion";
import { Code, Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-slate-800 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-center mt-4 mb-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SourceXchange. All rights reserved.
            </p>
          </div>
          
          {/* Glowing "Made by Arin" text with a completely different style */}
          <motion.div
            className="mb-8 relative py-12 px-14 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
              boxShadow: "0 0 30px rgba(79, 70, 229, 0.15)"
            }}
          >
            {/* Lightning background effects */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <path d="M30,10 L55,50 L40,50 L60,90" stroke="rgba(79, 70, 229, 0.8)" strokeWidth="1" fill="none" />
                <path d="M60,20 L35,60 L50,60 L30,80" stroke="rgba(168, 85, 247, 0.8)" strokeWidth="1" fill="none" />
                <path d="M45,5 L25,45 L40,45 L20,85" stroke="rgba(99, 102, 241, 0.8)" strokeWidth="0.8" fill="none" />
              </svg>
            </motion.div>
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-500 rounded-full"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-purple-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-300 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1
              }}
            />
            
            {/* Main text with glow */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold relative bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient pb-2"
              style={{ 
                marginBottom: "4px",
                letterSpacing: "0.5px",
                lineHeight: 1.4
              }}
              animate={{
                textShadow: [
                  "0 0 15px rgba(79, 70, 229, 0.5)",
                  "0 0 25px rgba(79, 70, 229, 0.7)",
                  "0 0 15px rgba(79, 70, 229, 0.5)"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Made by Arin
            </motion.h2>
            
            {/* Lightning bolt icon with animation */}
            <div className="flex justify-center mt-6">
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Zap className="w-8 h-8 text-yellow-400 drop-shadow-lightning" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
