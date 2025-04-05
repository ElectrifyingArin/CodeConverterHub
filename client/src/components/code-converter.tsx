import { useState, useEffect } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { SkillLevelSelector } from "@/components/skill-level-selector";
import { CodeEditor } from "@/components/ui/code-editor";
import { CodeExplanation } from "@/components/code-explanation";
import { OutputConsole } from "@/components/output-console";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCodeConversion } from "@/hooks/use-code-conversion";
import { getLanguageById } from "@/lib/supported-languages";
import { Clipboard, X, Play, ArrowRightLeft, ArrowDown, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Define typed code examples for different languages
interface CodeExamples {
  [key: string]: string;
}

const CODE_EXAMPLES: CodeExamples = {
  javascript: `// Simple function to add two numbers
function add(a, b) {
  return a + b;
}

// Calculate sum of 5 and 3
const result = add(5, 3);
console.log("The sum is:", result);`,

  python: `# Simple function to add two numbers
def add(a, b):
    return a + b

# Calculate sum of 5 and 3
result = add(5, 3)
print("The sum is:", result)`,

  typescript: `// Simple function to add two numbers
function add(a: number, b: number): number {
  return a + b;
}

// Calculate sum of 5 and 3
const result = add(5, 3);
console.log("The sum is:", result);`,

  java: `// Simple function to add two numbers
public class Calculator {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        // Calculate sum of 5 and 3
        int result = add(5, 3);
        System.out.println("The sum is: " + result);
    }
}`,

  csharp: `// Simple function to add two numbers
using System;

class Calculator {
    static int Add(int a, int b) {
        return a + b;
    }
    
    static void Main() {
        // Calculate sum of 5 and 3
        int result = Add(5, 3);
        Console.WriteLine("The sum is: " + result);
    }
}`,

  go: `// Simple function to add two numbers
package main

import "fmt"

func add(a, b int) int {
    return a + b
}

func main() {
    // Calculate sum of 5 and 3
    result := add(5, 3)
    fmt.Println("The sum is:", result)
}`,

  ruby: `# Simple function to add two numbers
def add(a, b)
  return a + b
end

# Calculate sum of 5 and 3
result = add(5, 3)
puts "The sum is: #{result}"`,

  php: `<?php
// Simple function to add two numbers
function add($a, $b) {
    return $a + $b;
}

// Calculate sum of 5 and 3
$result = add(5, 3);
echo "The sum is: " . $result;
?>`,

  swift: `// Simple function to add two numbers
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

// Calculate sum of 5 and 3
let result = add(5, 3)
print("The sum is: \(result)")`,

  rust: `// Simple function to add two numbers
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    // Calculate sum of 5 and 3
    let result = add(5, 3);
    println!("The sum is: {}", result);
}`,

  kotlin: `// Simple function to add two numbers
fun add(a: Int, b: Int): Int {
    return a + b
}

fun main() {
    // Calculate sum of 5 and 3
    val result = add(5, 3)
    println("The sum is: $result")
}`,

  dart: `// Simple function to add two numbers
int add(int a, int b) {
  return a + b;
}

void main() {
  // Calculate sum of 5 and 3
  var result = add(5, 3);
  print("The sum is: $result");
}`,

  r: `# Simple function to add two numbers
add <- function(a, b) {
  return(a + b)
}

# Calculate sum of 5 and 3
result <- add(5, 3)
print(paste("The sum is:", result))`,

  julia: `# Simple function to add two numbers
function add(a, b)
    return a + b
end

# Calculate sum of 5 and 3
result = add(5, 3)
println("The sum is: $result")`,

  shell: `#!/bin/bash
# Simple function to add two numbers
add() {
  echo $(($1 + $2))
}

# Calculate sum of 5 and 3
result=$(add 5 3)
echo "The sum is: $result"`,
};

export function CodeConverter() {
  const [sourceLanguage, setSourceLanguage] = useState<string>("javascript");
  const [targetLanguage, setTargetLanguage] = useState<string>("python");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [generateReadme, setGenerateReadme] = useState(false);
  const [generateApi, setGenerateApi] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  
  // Use the example for the selected language, or default to JavaScript
  const [sourceCode, setSourceCode] = useState(CODE_EXAMPLES.javascript);

  const {
    convert,
    isConverting,
    result,
    runCode,
    runOutput,
    clearOutput,
  } = useCodeConversion();

  const handleConvertCode = () => {
    if (!sourceCode?.trim()) {
      toast({
        title: "Error",
        description: "Please enter some source code to convert",
        variant: "destructive",
      });
      return;
    }

    // Start the animation
    setIsAnimating(true);
    
    // Wait for animation to complete before sending the request
    setTimeout(() => {
      convert({
        sourceCode,
        sourceLanguage,
        targetLanguage,
        skillLevel: skillLevel as "beginner" | "intermediate" | "advanced",
        generateReadme,
        generateApi,
      });
      
      // Stop the animation after conversion is done
      setTimeout(() => setIsAnimating(false), 500);
    }, 600);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    });
  };

  const clearSourceCode = () => {
    setSourceCode("");
  };

  const executeTargetCode = () => {
    if (!result?.targetCode) return;
    
    clearOutput();
    runCode(
      result.targetCode,
      getLanguageById(targetLanguage).displayName
    );
  };

  // Swap source and target languages
  const swapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
  };

  // Make sure languages are different and update source code
  useEffect(() => {
    // Update source code when language changes - safely access as key
    const langExample = sourceLanguage as keyof typeof CODE_EXAMPLES;
    if (CODE_EXAMPLES[langExample]) {
      setSourceCode(CODE_EXAMPLES[langExample]);
    } else {
      // Fallback to JavaScript if the language isn't in our examples
      setSourceCode(CODE_EXAMPLES.javascript);
    }
    
    // Ensure source and target languages are different
    if (sourceLanguage === targetLanguage) {
      // Default to Python if JavaScript is selected for both
      if (sourceLanguage === "javascript") {
        setTargetLanguage("python");
      } else {
        setTargetLanguage("javascript");
      }
    }
  }, [sourceLanguage, targetLanguage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Settings panel */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4"
      >
        <h3 className="font-semibold mb-4 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-primary" />
          Settings
        </h3>
        
        <div className="space-y-5">
          <div className="relative">
            <LanguageSelector
              label="From Language"
              value={sourceLanguage}
              onChange={setSourceLanguage}
              excludeValue={targetLanguage}
            />
            
            <div className="absolute left-1/2 -translate-x-1/2 my-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={swapLanguages}
                className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-transform hover:scale-110"
                title="Swap languages"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-7">
              <LanguageSelector
                label="To Language"
                value={targetLanguage}
                onChange={setTargetLanguage}
                excludeValue={sourceLanguage}
              />
            </div>
          </div>
          
          <SkillLevelSelector
            value={skillLevel}
            onChange={setSkillLevel}
          />
          
          <Button
            className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
            onClick={handleConvertCode}
            disabled={isConverting || isAnimating}
          >
            {isConverting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Converting...
              </>
            ) : (
              "Convert Code"
            )}
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-semibold mb-3">Additional Options</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="generate-readme" className="text-sm">Generate README</Label>
              <Switch
                id="generate-readme"
                checked={generateReadme}
                onCheckedChange={setGenerateReadme}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content area */}
      <div className="lg:col-span-4 space-y-6">
        {/* Code editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Animation overlay when converting */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm rounded-lg"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <ArrowRightLeft className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Source code editor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="font-medium">
                Source Code ({getLanguageById(sourceLanguage).displayName})
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(sourceCode)}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Copy code"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSourceCode}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Clear code"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900">
              <CodeEditor
                value={sourceCode}
                onChange={setSourceCode}
                language={getLanguageById(sourceLanguage)}
                height="300px"
              />
            </div>
          </motion.div>
          
          {/* Target code editor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="font-medium">
                Converted Code ({getLanguageById(targetLanguage).displayName})
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => result?.targetCode && copyCode(result.targetCode)}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Copy code"
                  disabled={!result?.targetCode}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={executeTargetCode}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Run code"
                  disabled={!result?.targetCode}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900">
              <CodeEditor
                value={result?.targetCode || "// Converted code will appear here"}
                language={getLanguageById(targetLanguage)}
                readOnly
                height="300px"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Explanation panel */}
        <AnimatePresence>
          {result?.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CodeExplanation
                explanation={result.explanation}
                expanded={explanationExpanded}
                onToggleExpand={() => setExplanationExpanded(!explanationExpanded)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Output console */}
        <AnimatePresence>
          {runOutput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <OutputConsole output={runOutput} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Additional outputs */}
        <AnimatePresence>
          {result?.readme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-medium">Generated README</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(result.readme!)}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Copy README"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 max-h-96 overflow-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded">{result.readme}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {result?.apiDocs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-medium">Generated API Documentation</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(result.apiDocs!)}
                  className="h-8 w-8 rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  title="Copy API Docs"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 max-h-96 overflow-auto">
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded">{result.apiDocs}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
