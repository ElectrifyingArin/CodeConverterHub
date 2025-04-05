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
          
          {/* Simple elegant "Made by Arin" */}
          <div className="mb-2 flex flex-col items-center">
            <motion.div
              className="py-2 px-4 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Text with heartbeat motion to match the bolt */}
              <motion.h2 
                className="text-3xl font-semibold text-violet-500"
                style={{ 
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  letterSpacing: "0.5px",
                  textShadow: "0 0 10px rgba(124, 58, 237, 0.5)"
                }}
                animate={{
                  scale: [1, 1.03, 1, 1.03, 1],
                  textShadow: [
                    "0 0 10px rgba(124, 58, 237, 0.4)",
                    "0 0 15px rgba(124, 58, 237, 0.6)",
                    "0 0 10px rgba(124, 58, 237, 0.4)",
                    "0 0 15px rgba(124, 58, 237, 0.6)",
                    "0 0 10px rgba(124, 58, 237, 0.4)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                Made by Arin
              </motion.h2>
              
              {/* Lightning bolt icon with heartbeat-like animation that matches the text */}
              <motion.div
                className="mt-3"
                animate={{
                  y: [0, -3, 0, -3, 0],
                  scale: [1, 1.15, 1, 1.15, 1],
                  filter: [
                    "drop-shadow(0 0 5px rgba(250, 204, 21, 0.6))",
                    "drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))",
                    "drop-shadow(0 0 5px rgba(250, 204, 21, 0.6))", 
                    "drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))",
                    "drop-shadow(0 0 5px rgba(250, 204, 21, 0.6))"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-7 h-7 text-amber-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
