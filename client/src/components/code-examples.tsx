import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeEditor } from "@/components/ui/code-editor";
import { getLanguageById } from "@/lib/supported-languages";
import { SupportedLanguage } from "@/lib/supported-languages";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Define the example code snippets
const codeExamples = [
  {
    title: "Fibonacci Sequence",
    language: "javascript",
    code: `// Function to calculate fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  
  let fib = [0, 1];
  
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i-1] + fib[i-2];
  }
  
  return fib[n];
}

// Calculate first 10 fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci sequence:", results);`
  },
  {
    title: "Binary Search Algorithm",
    language: "javascript",
    code: `// Binary search implementation
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found the target at index mid
    } else if (arr[mid] < target) {
      left = mid + 1; // Target is in the right half
    } else {
      right = mid - 1; // Target is in the left half
    }
  }
  
  return -1; // Target not found
}

// Example usage
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;
const result = binarySearch(sortedArray, target);
console.log(\`Found target \${target} at index: \${result}\`);`
  },
  {
    title: "Simple Todo App",
    language: "javascript",
    code: `// Todo list implementation
class TodoList {
  constructor() {
    this.todos = [];
  }
  
  addTodo(text) {
    this.todos.push({
      id: Date.now(),
      text,
      completed: false
    });
  }
  
  toggleTodo(id) {
    this.todos = this.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }
  
  removeTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }
  
  getTodos() {
    return this.todos;
  }
}

// Example usage
const todoList = new TodoList();
todoList.addTodo("Learn JavaScript");
todoList.addTodo("Build an app");
todoList.toggleTodo(todoList.todos[0].id);
console.log("Todo list:", todoList.getTodos());`
  },
  {
    title: "API Data Fetching",
    language: "javascript",
    code: `// Fetch data from a REST API
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetching user data failed:", error);
    return null;
  }
}

// Process the data
async function displayUserInfo(userId) {
  const userData = await fetchUserData(userId);
  
  if (userData) {
    console.log("User Information:");
    console.log(\`Name: \${userData.name}\`);
    console.log(\`Email: \${userData.email}\`);
    console.log(\`Role: \${userData.role}\`);
  } else {
    console.log("Failed to load user data");
  }
}

// Example call
displayUserInfo(123);`
  },
  {
    title: "Sorting Algorithms",
    language: "javascript",
    code: `// Bubble sort implementation
function bubbleSort(arr) {
  const len = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  
  return arr;
}

// Quick sort implementation
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example usage
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Bubble sort:", bubbleSort([...unsortedArray]));
console.log("Quick sort:", quickSort([...unsortedArray]));`
  }
];

export function CodeExamples() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const { toast } = useToast();

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? codeExamples.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === codeExamples.length - 1 ? 0 : prevIndex + 1
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code example has been copied to your clipboard",
    });
  };

  const currentExample = codeExamples[currentIndex];
  const language = getLanguageById(currentExample.language);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative py-4 overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
        Code Examples
      </h2>
      
      <div className="relative mx-auto max-w-4xl">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <Card className="shadow-lg border-2 border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-medium text-lg">{currentExample.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(currentExample.code)}
                  className="rounded-full transition-transform hover:scale-110"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-0 overflow-hidden rounded-b-lg">
                <CodeEditor
                  value={currentExample.code}
                  language={language}
                  readOnly
                  height="300px"
                />
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="rounded-full transition-transform hover:scale-110 bg-white dark:bg-slate-800"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex space-x-2 items-center">
          {codeExamples.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                ? "bg-primary scale-125" 
                : "bg-slate-300 dark:bg-slate-600"
              }`}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="rounded-full transition-transform hover:scale-110 bg-white dark:bg-slate-800"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}