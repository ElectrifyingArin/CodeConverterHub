import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeConverter } from "@/components/code-converter";
import { CodeExamples } from "@/components/code-examples";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown } from "lucide-react";

export default function Home() {
  const [showExamples, setShowExamples] = useState(false);
  // Add complexity state
  const [complexity, setComplexity] = useState<"simple" | "complex">("simple");

  // Switch between converter and examples tabs
  const toggleView = (view: 'converter' | 'examples') => {
    setShowExamples(view === 'examples');
  };

  // Toggle between simple and complex examples
  const toggleComplexity = () => {
    setComplexity(prev => prev === "simple" ? "complex" : "simple");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Convert code between 15+ programming languages with detailed explanations and examples.
          </p>
        </motion.div>
        
        <div className="mb-8 flex justify-center">
          <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => toggleView('converter')}
              className={`px-4 py-2 rounded-md transition-all ${
                !showExamples 
                  ? "bg-white dark:bg-slate-700 shadow-sm font-medium text-primary" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Converter
            </button>
            <button
              onClick={() => toggleView('examples')}
              className={`px-4 py-2 rounded-md transition-all ${
                showExamples 
                  ? "bg-white dark:bg-slate-700 shadow-sm font-medium text-primary" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Examples
            </button>
          </div>
        </div>
        
        {/* Complexity selector (only visible when showing examples) */}
        {showExamples && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-sm">
              <span className="text-sm text-slate-500 dark:text-slate-400">Complexity:</span>
              <Button
                onClick={toggleComplexity}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <span className="capitalize">{complexity}</span>
                <ArrowUpDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          key={`view-${showExamples}-${complexity}`} // Re-render on changes
        >
          {showExamples ? (
            <CodeExamples complexity={complexity} />
          ) : (
            <CodeConverter />
          )}
        </motion.div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
