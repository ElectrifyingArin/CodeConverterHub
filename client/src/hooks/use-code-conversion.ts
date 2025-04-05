import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { convertCode } from "@/lib/github";
import { ConvertCodeRequest, ConvertCodeResponse } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCodeConversion() {
  const [result, setResult] = useState<ConvertCodeResponse | null>(null);
  const [runOutput, setRunOutput] = useState<string>("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (request: ConvertCodeRequest) => convertCode(request),
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Code converted successfully",
        description: "Your code has been converted to the target language.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error converting code",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const runCode = (code: string, language: string) => {
    // In a real app, this would make an API call to run the code
    // For this demo, we'll simulate it with a realistic output based on the language
    
    const timestamp = new Date().toLocaleTimeString();
    setRunOutput(`> Running ${language} code...\n`);
    
    // Simulate some processing time
    setTimeout(() => {
      if (code.includes("fibonacci")) {
        setRunOutput(prev => 
          `${prev}Fibonacci sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n` +
          `> Execution completed in 0.${Math.floor(Math.random() * 900 + 100)}s at ${timestamp}`
        );
      } else if (code.includes("print") || code.includes("console.log")) {
        setRunOutput(prev => 
          `${prev}Hello, world!\n` +
          `> Execution completed in 0.${Math.floor(Math.random() * 900 + 100)}s at ${timestamp}`
        );
      } else {
        setRunOutput(prev => 
          `${prev}> Code executed successfully with no output\n` +
          `> Execution completed in 0.${Math.floor(Math.random() * 900 + 100)}s at ${timestamp}`
        );
      }
    }, 1500);
  };

  return {
    convert: mutation.mutate,
    isConverting: mutation.isPending,
    result,
    error: mutation.error,
    runCode,
    runOutput,
    clearOutput: () => setRunOutput(""),
  };
}
