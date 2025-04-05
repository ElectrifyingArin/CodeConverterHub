import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-slate-800 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="text-center mb-10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SourceXchange. All rights reserved.
            </p>
          </div>
          
          {/* Clean "Made by Arin" with lightning animation */}
          <div className="mb-2 flex flex-col items-center">
            {/* Main text */}
            <motion.div 
              className="flex items-center justify-center gap-3 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <motion.h2 
                  className="font-mono text-3xl font-bold text-purple-500"
                  style={{ 
                    textShadow: "0 0 15px rgba(168, 85, 247, 0.6)" 
                  }}
                >
                  Made by Arin
                </motion.h2>
              </motion.div>
            </motion.div>
            
            {/* Lightning bolt icon with animation */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Zap className="w-8 h-8 text-yellow-400 drop-shadow-lightning" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
