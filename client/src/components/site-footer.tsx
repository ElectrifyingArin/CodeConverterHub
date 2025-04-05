import { motion } from "framer-motion";
import { Code, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-slate-800 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                <Code className="w-6 h-6 text-primary relative" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                SourceXchange
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Convert code between 15+ programming languages with detailed explanations.
            </p>
          </motion.div>
          
          {/* Glowing "Made by Arin" text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mb-8 relative py-8"
          >
            {/* Glowing orb effect behind the text */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-2xl rounded-full animate-pulse"></div>
            
            {/* Sparkle effects */}
            <motion.div
              className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full"
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
              className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full"
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
            
            {/* Text with glowing animation */}
            <h2 className="text-2xl md:text-3xl font-bold relative bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient">
              Made by Arin
            </h2>
            
            {/* Heart icon with animation */}
            <div className="flex justify-center mt-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Heart className="w-6 h-6 text-red-500 drop-shadow-glow" />
              </motion.div>
            </div>
          </motion.div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SourceXchange. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
