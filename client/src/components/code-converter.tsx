import { useState, useEffect } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { SkillLevelSelector } from "@/components/skill-level-selector";
import { CodeEditor } from "@/components/ui/code-editor";
import { CodeExplanation } from "@/components/code-explanation";
import { OutputConsole } from "@/components/output-console";
import { CodeLoading } from "@/components/code-loading";
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

// Export the interface for code examples
export interface CodeExamplesCollection {
  simple: CodeExamples;
  complex: CodeExamples;
}

// Code examples organized by complexity level and language
export const CODE_EXAMPLES: CodeExamplesCollection = {
  simple: {
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
  },
  complex: {
    javascript: `// Async data fetching with error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const userData = await response.json();
    
    // Process and transform the data
    return {
      ...userData,
      fullName: \`\${userData.firstName} \${userData.lastName}\`,
      isActive: userData.status === 'active',
      lastLoginDate: userData.lastLogin ? new Date(userData.lastLogin) : null
    };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
}

// Usage with async/await and promise chaining
(async () => {
  const user = await fetchUserData(123);
  
  if (user) {
    console.log(\`Found user: \${user.fullName}\`);
    
    // Process user data further
    fetchUserData(user.managerId)
      .then(manager => {
        if (manager) {
          console.log(\`User's manager: \${manager.fullName}\`);
        }
      })
      .catch(err => console.error("Manager fetch failed:", err));
  }
})();`,

    python: `# Data processing with classes and context managers
import csv
import os
from dataclasses import dataclass
from typing import List, Optional
from contextlib import contextmanager

@dataclass
class Student:
    id: int
    name: str
    grade: float
    courses: List[str]
    
    def is_honor_roll(self) -> bool:
        return self.grade >= 3.5
    
    def add_course(self, course: str) -> None:
        if course not in self.courses:
            self.courses.append(course)

class StudentRegistry:
    def __init__(self, data_file: str):
        self.data_file = data_file
        self.students = {}
        
    @contextmanager
    def open_data_file(self, mode='r'):
        """Context manager for file operations"""
        file = open(self.data_file, mode)
        try:
            yield file
        finally:
            file.close()
    
    def load_students(self) -> None:
        """Load students from CSV file"""
        if not os.path.exists(self.data_file):
            return
            
        with self.open_data_file() as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            
            for row in reader:
                if len(row) >= 4:
                    student_id = int(row[0])
                    name = row[1]
                    grade = float(row[2])
                    courses = row[3].split(';') if row[3] else []
                    
                    self.students[student_id] = Student(
                        id=student_id,
                        name=name,
                        grade=grade,
                        courses=courses
                    )
    
    def get_student(self, student_id: int) -> Optional[Student]:
        """Get a student by ID"""
        return self.students.get(student_id)
    
    def get_honor_roll_students(self) -> List[Student]:
        """Get all students on the honor roll"""
        return [s for s in self.students.values() if s.is_honor_roll()]

# Usage example
registry = StudentRegistry("students.csv")
registry.load_students()

# Find honor roll students
honor_students = registry.get_honor_roll_students()
print(f"Found {len(honor_students)} honor roll students")

# Get a specific student
if student := registry.get_student(12345):
    print(f"Student {student.name} has a grade of {student.grade}")
    student.add_course("Computer Science")
else:
    print("Student not found")`,

    typescript: `// Generic type-safe event system
type EventCallback<T> = (data: T) => void;

class EventEmitter<EventMap extends Record<string, any>> {
  private listeners = new Map<
    keyof EventMap, 
    Set<EventCallback<any>>
  >();

  public on<E extends keyof EventMap>(
    event: E, 
    callback: EventCallback<EventMap[E]>
  ): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return this;
  }

  public off<E extends keyof EventMap>(
    event: E, 
    callback: EventCallback<EventMap[E]>
  ): this {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
    return this;
  }

  public emit<E extends keyof EventMap>(
    event: E, 
    data: EventMap[E]
  ): boolean {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return false;
    
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(\`Error in event \${String(event)} callback:\`, error);
      }
    });
    
    return true;
  }
}

// Application-specific events
interface AppEvents {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string; timestamp: number };
  'data:update': { entityId: string; field: string; value: any };
}

// Create typed event emitter
const appEvents = new EventEmitter<AppEvents>();

// Add strongly-typed event listeners
appEvents.on('user:login', ({ userId, timestamp }) => {
  console.log(\`User \${userId} logged in at \${new Date(timestamp).toISOString()}\`);
});

appEvents.on('data:update', ({ entityId, field, value }) => {
  console.log(\`Entity \${entityId} updated: \${field} = \${value}\`);
});

// Emit events with type checking
appEvents.emit('user:login', { 
  userId: 'user123', 
  timestamp: Date.now() 
});

appEvents.emit('data:update', {
  entityId: 'entity456',
  field: 'status',
  value: 'active'
});`,

    java: `// Multithreaded processor with Observer pattern
import java.util.concurrent.*;
import java.util.*;

interface ProcessListener {
    void onProcessed(String item, boolean success);
    void onComplete(int total, int success);
}

class WorkProcessor {
    private final ExecutorService executor;
    private final List<ProcessListener> listeners = new CopyOnWriteArrayList<>();
    
    public WorkProcessor(int threadCount) {
        this.executor = Executors.newFixedThreadPool(threadCount);
    }
    
    public void addListener(ProcessListener listener) {
        listeners.add(listener);
    }
    
    public void process(List<String> items) {
        CompletableFuture<?>[] futures = new CompletableFuture[items.size()];
        AtomicInteger successCount = new AtomicInteger(0);
        
        for (int i = 0; i < items.size(); i++) {
            final String item = items.get(i);
            futures[i] = CompletableFuture.runAsync(() -> {
                boolean success = false;
                try {
                    // Simulate work
                    Thread.sleep((long) (Math.random() * 1000));
                    success = Math.random() > 0.3; // 70% success rate
                    
                    if (success) {
                        successCount.incrementAndGet();
                    }
                } catch (Exception e) {
                    success = false;
                } finally {
                    // Notify listeners about item completion
                    for (ProcessListener listener : listeners) {
                        listener.onProcessed(item, success);
                    }
                }
            }, executor);
        }
        
        // Wait for all tasks to complete
        CompletableFuture.allOf(futures).thenRun(() -> {
            // Notify listeners about overall completion
            for (ProcessListener listener : listeners) {
                listener.onComplete(items.size(), successCount.get());
            }
            
            // Clean up resources
            executor.shutdown();
        });
    }
    
    public static void main(String[] args) {
        List<String> workItems = Arrays.asList(
            "Task 1", "Task 2", "Task 3", "Task 4", "Task 5"
        );
        
        WorkProcessor processor = new WorkProcessor(3);
        
        // Add a listener
        processor.addListener(new ProcessListener() {
            @Override
            public void onProcessed(String item, boolean success) {
                System.out.println(item + ": " + (success ? "Successful" : "Failed"));
            }
            
            @Override
            public void onComplete(int total, int success) {
                System.out.println("Processing complete: " + success + "/" + total + " successful");
            }
        });
        
        // Start processing
        processor.process(workItems);
    }
}`,

    // Add more complex examples for other languages as needed
  }
};

export function CodeConverter() {
  const [sourceLanguage, setSourceLanguage] = useState<string>("javascript");
  const [targetLanguage, setTargetLanguage] = useState<string>("python");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [generateReadme, setGenerateReadme] = useState(false);
  const [generateApi, setGenerateApi] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  
  // Add state for complexity level
  const [complexityLevel, setComplexityLevel] = useState<"simple" | "complex">("simple");
  
  // Source code state - initialize empty 
  const [sourceCode, setSourceCode] = useState("");

  const {
    convert,
    isConverting,
    result,
    runCode,
    runOutput,
    clearOutput,
  } = useCodeConversion();

  // Update source code when language or complexity changes
  useEffect(() => {
    const langExamples = CODE_EXAMPLES[complexityLevel];
    if (langExamples && langExamples[sourceLanguage]) {
      setSourceCode(langExamples[sourceLanguage]);
    } else {
      // Fallback to JavaScript if the language isn't in our examples
      setSourceCode(CODE_EXAMPLES.simple.javascript);
    }
  }, [sourceLanguage, complexityLevel]);

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

  // Ensure source and target languages are different
  useEffect(() => {
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
          
          <div className="space-y-3">
            <label className="text-sm font-medium">Example Complexity</label>
            <div className="flex space-x-3">
              <Button
                variant={complexityLevel === "simple" ? "default" : "outline"}
                size="sm" 
                onClick={() => setComplexityLevel("simple")}
                className="flex-1"
              >
                Simple
              </Button>
              <Button
                variant={complexityLevel === "complex" ? "default" : "outline"}
                size="sm"
                onClick={() => setComplexityLevel("complex")}
                className="flex-1"
              >
                Complex
              </Button>
            </div>
          </div>
          
          <Button
            className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
            onClick={handleConvertCode}
            disabled={isConverting || isAnimating}
          >
            {isConverting ? (
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="inline-block mr-2 relative">
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <svg className="w-4 h-4 text-white relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 4L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                Converting...
              </motion.div>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="generate-api" className="text-sm">Generate API Docs</Label>
              <Switch
                id="generate-api"
                checked={generateApi}
                onCheckedChange={setGenerateApi}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content area */}
      <div className="lg:col-span-4 space-y-6">
        {/* Code editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Cute mascots loading animation */}
          <AnimatePresence>
            {(isAnimating || isConverting) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm rounded-lg"
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
                  <CodeLoading
                    isLoading={true}
                    text={`Converting ${getLanguageById(sourceLanguage).displayName} to ${getLanguageById(targetLanguage).displayName}...`}
                  />
                </div>
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
                expanded={true}
                onToggleExpand={() => {/* No toggling */}}
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
