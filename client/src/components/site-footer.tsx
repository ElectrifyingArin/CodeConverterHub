import { Link } from "wouter";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-white dark:bg-slate-800 py-6 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
                <svg className="w-8 h-8 text-primary relative" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 12L8 7V17L14 12Z" fill="currentColor"/>
                  <path d="M16 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                SourceXchange
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Convert code between 15+ programming languages with detailed explanations.
            </p>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="GitHub Repository"
            >
              <Github size={18} />
            </motion.a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            <Link href="/examples" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
              Examples
            </Link>
            <Link href="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SourceXchange. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Powered by GitHub API
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
