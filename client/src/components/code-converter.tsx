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
import { Clipboard, X, Play } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_CODE = `// Function to calculate fibonacci sequence
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

console.log("Fibonacci sequence:", results);`;

export function CodeConverter() {
  const [sourceCode, setSourceCode] = useState(SAMPLE_CODE);
  const [sourceLanguage, setSourceLanguage] = useState("javascript");
  const [targetLanguage, setTargetLanguage] = useState("python");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [generateReadme, setGenerateReadme] = useState(false);
  const [generateApi, setGenerateApi] = useState(false);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const { toast } = useToast();

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

    convert({
      sourceCode,
      sourceLanguage,
      targetLanguage,
      skillLevel: skillLevel as "beginner" | "intermediate" | "advanced",
      generateReadme,
      generateApi,
    });
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

  // Make sure languages are different
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
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Settings</h3>
        
        <div className="space-y-4">
          <LanguageSelector
            label="From Language"
            value={sourceLanguage}
            onChange={setSourceLanguage}
            excludeValue={targetLanguage}
          />
          
          <LanguageSelector
            label="To Language"
            value={targetLanguage}
            onChange={setTargetLanguage}
            excludeValue={sourceLanguage}
          />
          
          <SkillLevelSelector
            value={skillLevel}
            onChange={setSkillLevel}
          />
          
          <Button
            className="w-full py-2 bg-primary hover:bg-primary/90 text-white"
            onClick={handleConvertCode}
            disabled={isConverting}
          >
            {isConverting ? "Converting..." : "Convert Code"}
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
      </div>
      
      {/* Main content area */}
      <div className="lg:col-span-4 space-y-6">
        {/* Code editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source code editor */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="font-medium text-sm">
                Source Code ({getLanguageById(sourceLanguage).displayName})
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyCode(sourceCode)}
                  className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
                  title="Copy code"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSourceCode}
                  className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
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
          </div>
          
          {/* Target code editor */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700">
              <div className="font-medium text-sm">
                Converted Code ({getLanguageById(targetLanguage).displayName})
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => result?.targetCode && copyCode(result.targetCode)}
                  className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
                  title="Copy code"
                  disabled={!result?.targetCode}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={executeTargetCode}
                  className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
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
          </div>
        </div>
        
        {/* Explanation panel */}
        {result?.explanation && (
          <CodeExplanation
            explanation={result.explanation}
            expanded={explanationExpanded}
            onToggleExpand={() => setExplanationExpanded(!explanationExpanded)}
          />
        )}
        
        {/* Output console */}
        <OutputConsole output={runOutput} />
        
        {/* Additional outputs */}
        {result?.readme && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-medium">Generated README</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyCode(result.readme!)}
                className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
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
          </div>
        )}
        
        {result?.apiDocs && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-medium">Generated API Documentation</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyCode(result.apiDocs!)}
                className="h-7 w-7 p-1 text-slate-500 hover:text-primary"
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
          </div>
        )}
      </div>
    </div>
  );
}
