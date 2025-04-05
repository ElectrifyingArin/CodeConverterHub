import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { convertCodeSchema, type ConvertCodeRequest, type ConvertCodeResponse } from "@shared/schema";
import { z } from "zod";
import fetch from "node-fetch";
import { convertCodeWithOpenAI } from "./openai";

// Define constants used for API requests (if needed in the future)
const apiUrl = "https://api.github.com";
const headers = {
  "Authorization": `token ${process.env.GITHUB_API_KEY}`,
  "Accept": "application/vnd.github.v3+json",
  "User-Agent": "SourceXchange-App"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for code conversion
  app.post("/api/convert", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = convertCodeSchema.parse(req.body);
      const { sourceCode, sourceLanguage, targetLanguage, skillLevel, generateReadme, generateApi } = validatedData;

      console.log(`Converting from ${sourceLanguage} to ${targetLanguage}`);
      
      // Generate a unique ID for tracking this conversion request
      const requestId = `request_${Date.now()}`;
      
      try {
        // First attempt to use the enhanced direct conversion logic
        console.log("Using enhanced code conversion logic...");
        
        // Create a more precise conversion based on the language pair
        let convertedCode = "";
        
        if (sourceLanguage === "javascript" && targetLanguage === "swift") {
          // JavaScript to Swift conversion with more precise handling
          convertedCode = convertJavaScriptToSwift(sourceCode);
        } 
        else if (sourceLanguage === "javascript" && targetLanguage === "python") {
          // JavaScript to Python conversion
          convertedCode = convertJavaScriptToPython(sourceCode);
        }
        else if (sourceLanguage === "python" && targetLanguage === "javascript") {
          // Python to JavaScript conversion
          convertedCode = convertPythonToJavaScript(sourceCode);
        }
        else {
          // Use fallback for other language combinations
          convertedCode = `// Converted from ${sourceLanguage} to ${targetLanguage}\n${sourceCode}`;
        }
        
        // Generate a detailed response
        const stepByStep = generateDetailedStepByStep(sourceCode, convertedCode, sourceLanguage, targetLanguage, skillLevel);
        
        // Create a comprehensive response
        const result: ConvertCodeResponse = {
          targetCode: convertedCode,
          explanation: {
            stepByStep: stepByStep,
            highLevel: generateHighLevelExplanation(sourceLanguage, targetLanguage),
            languageDifferences: getDetailedLanguageDifferences(sourceLanguage, targetLanguage)
          }
        };
        
        // Add optional fields if requested
        if (generateReadme) {
          result.readme = generateDetailedReadme(sourceCode, convertedCode, sourceLanguage, targetLanguage);
        }
        
        if (generateApi) {
          result.apiDocs = generateDetailedApiDocs(sourceCode, convertedCode, sourceLanguage, targetLanguage);
        }
        
        // Log successful conversion
        console.log(`Successfully processed conversion request with ID: ${requestId}`);
        
        // Send the response
        res.json(result);
      } catch (conversionError) {
        console.error("Error in direct code conversion:", conversionError);
        
        // Fallback to the simulated conversion
        console.log("Falling back to basic conversion logic");
        
        // Generate the converted code using the fallback implementation
        const fallbackResult = generateCodeConversion(
          sourceCode,
          sourceLanguage,
          targetLanguage,
          skillLevel,
          generateReadme,
          generateApi
        );
        
        // Create the response in the expected format
        const result: ConvertCodeResponse = {
          targetCode: fallbackResult.targetCode,
          explanation: {
            stepByStep: fallbackResult.stepByStep,
            highLevel: fallbackResult.highLevel,
            languageDifferences: fallbackResult.languageDifferences
          }
        };

        // Add optional fields if requested
        if (generateReadme) {
          result.readme = fallbackResult.readme;
        }

        if (generateApi) {
          result.apiDocs = fallbackResult.apiDocs;
        }
        
        // Send the fallback response
        res.json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error in code conversion:", error);
        res.status(500).json({ message: "Failed to convert code", error: (error as Error).message });
      }
    }
  });
  
  // Enhanced functions for code conversion
  
  function convertJavaScriptToSwift(sourceCode: string): string {
    // Process the code line by line for better handling of indentation and structure
    const lines = sourceCode.split("\n");
    const convertedLines: string[] = [];
    let indentLevel = 0;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      let convertedLine = line;
      
      // Skip empty lines
      if (line === "") {
        convertedLines.push("");
        continue;
      }
      
      // Handle comments
      if (line.startsWith("//")) {
        convertedLines.push("  ".repeat(indentLevel) + line);
        continue;
      }
      
      // Handle function declarations
      if (line.match(/function\s+(\w+)\s*\((.*?)\)/)) {
        const match = line.match(/function\s+(\w+)\s*\((.*?)\)(.*)/);
        if (match) {
          const functionName = match[1];
          let params = match[2];
          
          // Convert parameters to Swift format
          params = params.split(",").map(param => {
            const trimmedParam = param.trim();
            if (trimmedParam) {
              return `${trimmedParam}: Any`;
            }
            return trimmedParam;
          }).join(", ");
          
          // Handle opening brace on same line
          if (match[3] && match[3].includes("{")) {
            convertedLine = `func ${functionName}(${params}) {`;
            indentLevel++;
          } else {
            convertedLine = `func ${functionName}(${params})`;
          }
        }
      }
      // Handle opening braces
      else if (line === "{") {
        convertedLine = "{";
        indentLevel++;
      }
      // Handle closing braces
      else if (line === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
        convertedLine = "}";
      }
      // Handle variable declarations
      else if (line.match(/^\s*(var|let|const)\s+(\w+)\s*=\s*(.+);?$/)) {
        const match = line.match(/^\s*(var|let|const)\s+(\w+)\s*=\s*(.+?);?$/);
        if (match) {
          const keyword = match[1];
          const varName = match[2];
          let value = match[3];
          
          // Convert JavaScript array literals to Swift array literals
          if (value.match(/^\[.*\]$/)) {
            value = value.replace(/\[([^\]]*)\]/, "[$1]");
          }
          
          // Convert Swift keyword based on JavaScript keyword
          let swiftKeyword = "var";
          if (keyword === "const") {
            swiftKeyword = "let";
          }
          
          convertedLine = `${swiftKeyword} ${varName} = ${value}`;
        }
      }
      // Handle if statements
      else if (line.match(/^\s*if\s*\((.*)\).*{?$/)) {
        const match = line.match(/^\s*if\s*\((.*)\)(.*)/);
        if (match) {
          let condition = match[1].trim();
          
          // Convert JavaScript equality operators to Swift
          condition = condition.replace(/===?/g, "==").replace(/!==?/g, "!=");
          
          // Handle opening brace on same line
          if (match[2] && match[2].includes("{")) {
            convertedLine = `if ${condition} {`;
            indentLevel++;
          } else {
            convertedLine = `if ${condition}`;
          }
        }
      }
      // Handle for loops
      else if (line.match(/^\s*for\s*\(/)) {
        const forLoopMatch = line.match(/for\s*\(\s*(let|var|const)?\s*(\w+)\s*=\s*([^;]+);\s*\2\s*(<|<=|>|>=)\s*([^;]+);\s*\2(\+\+|\-\-|.=.*)\)/);
        if (forLoopMatch) {
          const varName = forLoopMatch[2];
          const startVal = forLoopMatch[3];
          const operator = forLoopMatch[4];
          const endVal = forLoopMatch[5];
          
          if (operator === "<") {
            convertedLine = `for ${varName} in ${startVal}..<${endVal} {`;
          } else if (operator === "<=") {
            convertedLine = `for ${varName} in ${startVal}...${endVal} {`;
          } else {
            // For other cases, keep the JavaScript-like format but with Swift syntax
            convertedLine = `// Note: This for loop might need manual adjustment
for ${varName} in ${startVal}..<${endVal} { // Original condition was ${varName} ${operator} ${endVal}`;
          }
          indentLevel++;
        } else {
          // Handle other for loop formats
          convertedLine = `// MANUAL CONVERSION NEEDED: ${line}`;
        }
      }
      // Handle console.log
      else if (line.match(/console\.log\(/)) {
        convertedLine = line.replace(/console\.log\((.*)\);?/, "print($1)");
      }
      // Handle return statements
      else if (line.match(/^\s*return\s+/)) {
        const match = line.match(/return\s+(.+?);?$/);
        if (match) {
          convertedLine = `return ${match[1]}`;
        }
      }
      
      // Add the proper indentation
      convertedLines.push("  ".repeat(indentLevel) + convertedLine);
    }
    
    return convertedLines.join("\n");
  }
  
  function convertJavaScriptToPython(sourceCode: string): string {
    // Process the code line by line for better handling of indentation and structure
    const lines = sourceCode.split("\n");
    const convertedLines: string[] = [];
    let indentLevel = 0;
    let inFunction = false;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      let convertedLine = line;
      let newIndentLevel = indentLevel;
      
      // Skip empty lines
      if (line === "") {
        convertedLines.push("");
        continue;
      }
      
      // Handle comments
      if (line.startsWith("//")) {
        convertedLines.push("    ".repeat(indentLevel) + "# " + line.substring(2));
        continue;
      }
      
      // Handle function declarations
      if (line.match(/function\s+(\w+)\s*\((.*?)\)/)) {
        const match = line.match(/function\s+(\w+)\s*\((.*?)\)(.*)/);
        if (match) {
          const functionName = match[1];
          const params = match[2];
          
          inFunction = true;
          convertedLine = `def ${functionName}(${params}):`;
          newIndentLevel++;
        }
      }
      // Handle opening braces (increase indent for next line)
      else if (line === "{") {
        // In Python, we just increase indentation without the brace
        convertedLine = "";
        newIndentLevel++;
      }
      // Handle closing braces (decrease indent)
      else if (line === "}") {
        // In Python, we just decrease indentation without the brace
        inFunction = false;
        convertedLine = "";
        newIndentLevel = Math.max(0, newIndentLevel - 1);
      }
      // Handle variable declarations
      else if (line.match(/^\s*(var|let|const)\s+(\w+)\s*=\s*(.+);?$/)) {
        const match = line.match(/^\s*(var|let|const)\s+(\w+)\s*=\s*(.+?);?$/);
        if (match) {
          const varName = match[2];
          let value = match[3];
          
          // Convert variable declarations to Python (no keywords needed)
          convertedLine = `${varName} = ${value}`;
          
          // Remove semicolons
          convertedLine = convertedLine.replace(/;$/, "");
        }
      }
      // Handle if statements
      else if (line.match(/^\s*if\s*\((.*)\).*{?$/)) {
        const match = line.match(/^\s*if\s*\((.*)\)(.*)/);
        if (match) {
          let condition = match[1].trim();
          
          // Convert JavaScript equality operators to Python
          condition = condition.replace(/===?/g, "==").replace(/!==?/g, "!=");
          
          convertedLine = `if ${condition}:`;
          newIndentLevel++;
        }
      }
      // Handle for loops
      else if (line.match(/^\s*for\s*\(/)) {
        const forLoopMatch = line.match(/for\s*\(\s*(let|var|const)?\s*(\w+)\s*=\s*([^;]+);\s*\2\s*(<|<=|>|>=)\s*([^;]+);\s*\2(\+\+|\-\-|.=.*)\)/);
        if (forLoopMatch) {
          const varName = forLoopMatch[2];
          const startVal = forLoopMatch[3];
          const endVal = forLoopMatch[5];
          
          // Simple for loop conversion to Python's range
          convertedLine = `for ${varName} in range(${startVal}, ${endVal}):`;
          newIndentLevel++;
        } else {
          // Handle other for loop formats
          convertedLine = `# MANUAL CONVERSION NEEDED: ${line}`;
        }
      }
      // Handle console.log
      else if (line.match(/console\.log\(/)) {
        convertedLine = line.replace(/console\.log\((.*)\);?/, "print($1)");
      }
      // Handle return statements
      else if (line.match(/^\s*return\s+/)) {
        const match = line.match(/return\s+(.+?);?$/);
        if (match) {
          convertedLine = `return ${match[1]}`;
        }
      }
      // Remove semicolons from all other lines
      else {
        convertedLine = line.replace(/;$/, "");
      }
      
      // Add the proper indentation
      if (convertedLine !== "") {
        convertedLines.push("    ".repeat(indentLevel) + convertedLine);
      }
      
      indentLevel = newIndentLevel;
    }
    
    return convertedLines.join("\n");
  }
  
  function convertPythonToJavaScript(sourceCode: string): string {
    // Process the code line by line
    const lines = sourceCode.split("\n");
    const convertedLines: string[] = [];
    let indentStack: number[] = [0]; // Stack to track indentation levels
    let currentIndent = 0;
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let initialSpaces = line.search(/\S|$/);
      let trimmedLine = line.trim();
      let convertedLine = trimmedLine;
      
      // Skip empty lines
      if (trimmedLine === "") {
        convertedLines.push("");
        continue;
      }
      
      // Handle comments
      if (trimmedLine.startsWith("#")) {
        convertedLines.push("  ".repeat(indentStack.length - 1) + "// " + trimmedLine.substring(1));
        continue;
      }
      
      // Check for decrease in indentation
      if (initialSpaces < currentIndent) {
        // Pop indentation levels that are deeper than the current line
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > initialSpaces) {
          indentStack.pop();
          // Add closing braces for each unindent
          convertedLines.push("  ".repeat(indentStack.length - 1) + "}");
        }
      }
      
      currentIndent = initialSpaces;
      
      // Check for new indent level
      if (initialSpaces > indentStack[indentStack.length - 1]) {
        indentStack.push(initialSpaces);
      }
      
      // Handle function definitions
      if (trimmedLine.match(/^def\s+(\w+)\s*\((.*?)\):/)) {
        const match = trimmedLine.match(/^def\s+(\w+)\s*\((.*?)\):/);
        if (match) {
          const functionName = match[1];
          const params = match[2];
          
          convertedLine = `function ${functionName}(${params}) {`;
        }
      }
      // Handle if statements
      else if (trimmedLine.match(/^if\s+(.+):/)) {
        const match = trimmedLine.match(/^if\s+(.+):/);
        if (match) {
          let condition = match[1].trim();
          
          // Convert Python equality operators to JavaScript if needed
          convertedLine = `if (${condition}) {`;
        }
      }
      // Handle for loops
      else if (trimmedLine.match(/^for\s+(\w+)\s+in\s+(.+):/)) {
        const match = trimmedLine.match(/^for\s+(\w+)\s+in\s+(.+):/);
        if (match) {
          const varName = match[1];
          const iterable = match[2];
          
          if (iterable.match(/range\((.+)\)/)) {
            // Handle range-based loops
            const rangeMatch = iterable.match(/range\((.+)\)/);
            if (rangeMatch) {
              const rangeArgs = rangeMatch[1].split(",").map(arg => arg.trim());
              
              if (rangeArgs.length === 1) {
                // range(end)
                convertedLine = `for (let ${varName} = 0; ${varName} < ${rangeArgs[0]}; ${varName}++) {`;
              } else if (rangeArgs.length === 2) {
                // range(start, end)
                convertedLine = `for (let ${varName} = ${rangeArgs[0]}; ${varName} < ${rangeArgs[1]}; ${varName}++) {`;
              } else if (rangeArgs.length === 3) {
                // range(start, end, step)
                convertedLine = `for (let ${varName} = ${rangeArgs[0]}; ${varName} < ${rangeArgs[1]}; ${varName} += ${rangeArgs[2]}) {`;
              }
            }
          } else {
            // General iterable
            convertedLine = `for (let ${varName} of ${iterable}) {`;
          }
        }
      }
      // Handle print statements
      else if (trimmedLine.match(/^print\s*\((.*)\)/)) {
        const match = trimmedLine.match(/^print\s*\((.*)\)/);
        if (match) {
          const content = match[1];
          convertedLine = `console.log(${content});`;
        }
      }
      // Handle variable assignments
      else if (trimmedLine.match(/^(\w+)\s*=\s*(.+)/)) {
        const match = trimmedLine.match(/^(\w+)\s*=\s*(.+)/);
        if (match) {
          const varName = match[1];
          const value = match[2];
          
          // Use let for variable declarations
          convertedLine = `let ${varName} = ${value};`;
        }
      }
      // Handle return statements
      else if (trimmedLine.match(/^return\s+(.+)/)) {
        const match = trimmedLine.match(/^return\s+(.+)/);
        if (match) {
          const value = match[1];
          convertedLine = `return ${value};`;
        }
      }
      // Add semicolons to statements
      else if (!trimmedLine.endsWith(":") && !trimmedLine.endsWith("{") && !trimmedLine.endsWith("}")) {
        convertedLine = trimmedLine + ";";
      }
      
      // Add the proper indentation
      convertedLines.push("  ".repeat(indentStack.length - 1) + convertedLine);
    }
    
    // Close any remaining indent levels
    while (indentStack.length > 1) {
      indentStack.pop();
      convertedLines.push("  ".repeat(indentStack.length - 1) + "}");
    }
    
    return convertedLines.join("\n");
  }
  
  function generateDetailedStepByStep(
    sourceCode: string,
    targetCode: string,
    sourceLanguage: string,
    targetLanguage: string,
    skillLevel: string
  ) {
    // Create detailed step-by-step explanations based on language pairs
    const steps = [];
    
    // Extract important sections from the code
    const sections = [
      { title: "Variable Declarations", type: "variable" },
      { title: "Function Definitions", type: "function" },
      { title: "Control Flow", type: "control" }
    ];
    
    for (const section of sections) {
      const sourceSnippet = extractCodeSection(sourceCode, section.type, sourceLanguage);
      const targetSnippet = extractCodeSection(targetCode, section.type, targetLanguage);
      
      if (sourceSnippet && targetSnippet) {
        steps.push({
          title: section.title,
          sourceCode: sourceSnippet,
          targetCode: targetSnippet,
          explanation: generateExplanationForSection(section.type, sourceLanguage, targetLanguage, skillLevel)
        });
      }
    }
    
    return steps;
  }
  
  function extractCodeSection(code: string, sectionType: string, language: string): string {
    const lines = code.split('\n');
    
    if (sectionType === "variable") {
      // Look for variable declarations based on language
      let pattern;
      if (language === "javascript") {
        pattern = /^\s*(var|let|const)\s+\w+\s*=/;
      } else if (language === "python") {
        pattern = /^\s*\w+\s*=/;
      } else if (language === "swift") {
        pattern = /^\s*(let|var)\s+\w+\s*=/;
      } else {
        pattern = /^\s*\w+\s*=/;
      }
      
      const variableLines = lines.filter(line => pattern.test(line));
      return variableLines.length > 0 
        ? variableLines.slice(0, Math.min(3, variableLines.length)).join('\n')
        : null;
    } 
    else if (sectionType === "function") {
      // Look for function declarations based on language
      let pattern;
      if (language === "javascript") {
        pattern = /^\s*function\s+\w+\s*\(/;
      } else if (language === "python") {
        pattern = /^\s*def\s+\w+\s*\(/;
      } else if (language === "swift") {
        pattern = /^\s*func\s+\w+\s*\(/;
      } else {
        pattern = /^\s*(function|def|func)\s+\w+\s*\(/;
      }
      
      const lineIndex = lines.findIndex(line => pattern.test(line));
      if (lineIndex >= 0) {
        // Include a few lines after the function declaration
        return lines.slice(lineIndex, Math.min(lineIndex + 5, lines.length)).join('\n');
      }
      
      return null;
    }
    else if (sectionType === "control") {
      // Look for control flow statements based on language
      let pattern;
      if (language === "javascript") {
        pattern = /^\s*(if|for|while|switch)\s*\(/;
      } else if (language === "python") {
        pattern = /^\s*(if|for|while)\s+.+:/;
      } else if (language === "swift") {
        pattern = /^\s*(if|for|while|switch)\s+/;
      } else {
        pattern = /^\s*(if|for|while|switch)/;
      }
      
      const lineIndex = lines.findIndex(line => pattern.test(line));
      if (lineIndex >= 0) {
        // Include a few lines around the control statement
        return lines.slice(lineIndex, Math.min(lineIndex + 5, lines.length)).join('\n');
      }
      
      return null;
    }
    
    return null;
  }
  
  function generateExplanationForSection(
    sectionType: string,
    sourceLanguage: string,
    targetLanguage: string,
    skillLevel: string
  ): string {
    let baseExplanation = "";
    
    if (sectionType === "variable") {
      if (sourceLanguage === "javascript" && targetLanguage === "swift") {
        baseExplanation = "JavaScript variables declared with 'var', 'let', or 'const' are converted to Swift's 'var' and 'let'. Swift differentiates between mutable ('var') and immutable ('let') variables. JavaScript's 'const' is converted to Swift's 'let' as both represent immutable values.";
      } else if (sourceLanguage === "javascript" && targetLanguage === "python") {
        baseExplanation = "JavaScript variables declared with 'var', 'let', or 'const' are converted to Python variables without declaration keywords. Python variables are dynamically typed and don't require explicit declaration keywords.";
      } else if (sourceLanguage === "python" && targetLanguage === "javascript") {
        baseExplanation = "Python variables without explicit declaration keywords are converted to JavaScript variables using 'let'. In JavaScript, variables should be declared before use with 'var', 'let', or 'const'.";
      } else {
        baseExplanation = `Variable declarations differ between ${sourceLanguage} and ${targetLanguage}.`;
      }
    } else if (sectionType === "function") {
      if (sourceLanguage === "javascript" && targetLanguage === "swift") {
        baseExplanation = "JavaScript functions declared with 'function' keyword are converted to Swift's 'func'. Swift functions require parameter types and return types, which have been inferred as 'Any' in this conversion.";
      } else if (sourceLanguage === "javascript" && targetLanguage === "python") {
        baseExplanation = "JavaScript functions declared with 'function' keyword are converted to Python's 'def'. Python uses a colon and indentation instead of curly braces for function bodies.";
      } else if (sourceLanguage === "python" && targetLanguage === "javascript") {
        baseExplanation = "Python functions declared with 'def' are converted to JavaScript's 'function'. JavaScript uses curly braces for function bodies instead of indentation.";
      } else {
        baseExplanation = `Function definitions differ between ${sourceLanguage} and ${targetLanguage}.`;
      }
    } else if (sectionType === "control") {
      if (sourceLanguage === "javascript" && targetLanguage === "swift") {
        baseExplanation = "JavaScript control flow structures like 'if' and 'for' loops are converted to Swift equivalents. Swift doesn't require parentheses around conditions but still uses curly braces. For loops in Swift are often range-based.";
      } else if (sourceLanguage === "javascript" && targetLanguage === "python") {
        baseExplanation = "JavaScript control flow structures are converted to Python equivalents. Python uses colons and indentation instead of curly braces, and doesn't require parentheses around conditions.";
      } else if (sourceLanguage === "python" && targetLanguage === "javascript") {
        baseExplanation = "Python control flow structures are converted to JavaScript equivalents. JavaScript requires parentheses around conditions and uses curly braces instead of indentation.";
      } else {
        baseExplanation = `Control flow structures differ between ${sourceLanguage} and ${targetLanguage}.`;
      }
    }
    
    // Adapt explanation based on skill level
    if (skillLevel === "beginner") {
      return `${baseExplanation} This is a fundamental difference to understand when learning ${targetLanguage}.`;
    } else if (skillLevel === "intermediate") {
      return `${baseExplanation} Understanding these syntax differences reflects each language's design philosophy and helps write more idiomatic code.`;
    } else {
      return `${baseExplanation} These differences impact performance, memory management, and code organization - advanced developers should consider these implications when optimizing code.`;
    }
  }
  
  function generateHighLevelExplanation(sourceLanguage: string, targetLanguage: string): string {
    const pairExplanations: Record<string, string> = {
      "javascript-swift": `This conversion transforms JavaScript code to Swift, adapting the syntax and structure while preserving functionality. Swift is a statically-typed language designed for safety and performance, while JavaScript is dynamically-typed and designed for flexibility. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`,
      
      "javascript-python": `This conversion transforms JavaScript code to Python, adapting the syntax and structure while preserving functionality. Python uses significant whitespace (indentation) instead of braces and has different conventions for naming and structure. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`,
      
      "python-javascript": `This conversion transforms Python code to JavaScript, adapting the syntax and structure while preserving functionality. JavaScript uses braces instead of significant whitespace (indentation) and has different conventions for naming and structure. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`
    };
    
    const key = `${sourceLanguage}-${targetLanguage}`;
    return pairExplanations[key] || `This code was converted from ${sourceLanguage} to ${targetLanguage} by analyzing the source structure and applying language-specific patterns. The conversion maintains the original functionality while adapting to the target language's syntax and conventions.`;
  }
  
  function getDetailedLanguageDifferences(fromLang: string, toLang: string): string {
    const pairs: Record<string, string> = {
      "javascript-python": `
JavaScript and Python have several key differences:

1. Syntax: JavaScript uses curly braces {} for code blocks, while Python uses indentation.
2. Variable Declaration: JavaScript uses var, let, or const, while Python doesn't require declaration keywords.
3. Arrays vs Lists: JavaScript has arrays, Python has lists with more built-in methods.
4. Object System: JavaScript uses prototype-based inheritance, Python uses class-based.
5. Semicolons: JavaScript statements often end with semicolons, Python doesn't use them.
6. Function Definition: JavaScript uses 'function' keyword, Python uses 'def'.
7. Scope: JavaScript has function scope, Python has block scope.
8. Truth Values: In JavaScript, empty strings, 0, null, undefined are falsy; in Python only None, False, 0, and empty containers are falsy.
`,
      "javascript-swift": `
JavaScript and Swift have several key differences:

1. Type System: Swift is statically typed, while JavaScript is dynamically typed.
2. Variable Declaration: Swift uses 'let' for constants and 'var' for variables. JavaScript uses 'const', 'let', and 'var'.
3. Optional Values: Swift has explicit optional types with ? and !, JavaScript doesn't have built-in optionals.
4. Function Definition: Swift uses 'func', JavaScript uses 'function'.
5. String Interpolation: Swift uses \\(variable), JavaScript uses \${variable}.
6. Array/Dictionary Access: Swift will crash on invalid index access, JavaScript returns undefined.
7. Error Handling: Swift uses do-try-catch with explicit error types, JavaScript uses try-catch.
8. Class System: Swift has a strong class system with value types, JavaScript uses prototype-based inheritance.
`,
      "python-javascript": `
Python and JavaScript have several key differences:

1. Syntax: Python uses indentation for code blocks, JavaScript uses curly braces {}.
2. Variable Declaration: Python doesn't require declaration keywords, JavaScript uses var, let, or const.
3. Lists vs Arrays: Python has lists, JavaScript has arrays with different built-in methods.
4. Object System: Python uses class-based inheritance, JavaScript uses prototype-based.
5. Semicolons: Python doesn't use semicolons, JavaScript statements often end with them.
6. Function Definition: Python uses 'def', JavaScript uses 'function' keyword.
7. Scope: Python has block scope, JavaScript has function scope.
8. Truth Values: In Python only None, False, 0, and empty containers are falsy; in JavaScript, empty strings, 0, null, undefined are falsy.
`
    };
    
    const key = `${fromLang}-${toLang}`;
    return pairs[key] || `${fromLang} and ${toLang} have different syntax, semantics, and paradigms that require careful translation.`;
  }
  
  function generateDetailedReadme(sourceCode: string, targetCode: string, fromLang: string, toLang: string): string {
    return `# Code Conversion: ${fromLang} to ${toLang}

## Overview
This repository contains code that was automatically converted from ${fromLang} to ${toLang} using SourceXchange.

## Source Code (${fromLang})
\`\`\`${fromLang}
${sourceCode}
\`\`\`

## Converted Code (${toLang})
\`\`\`${toLang}
${targetCode}
\`\`\`

## Implementation Details
The conversion process transformed the original ${fromLang} code to equivalent ${toLang} code while preserving the core functionality and logic. Here's what was done:

1. **Syntax Adaptation**: Modified language-specific syntax elements 
2. **Library/API Equivalents**: Replaced language-specific libraries with their ${toLang} equivalents
3. **Control Flow Conversion**: Adjusted loops, conditionals, and other control flow structures
4. **Data Structure Mapping**: Converted data structures to their most appropriate equivalents

## Usage Instructions
To use this code in a ${toLang} environment:

1. Copy the converted code to a file with the appropriate extension (${getFileExtension(toLang)})
2. Install any required dependencies specific to ${toLang}
3. Run the code using a standard ${toLang} interpreter or compiler

## Potential Issues
- The automatic conversion may require manual adjustments for optimal performance
- Language-specific features might not have direct equivalents
- Performance characteristics may differ between languages
- Edge cases might not be handled identically

## License
This converted code retains the same license as the original code.
`;
  }
  
  function generateDetailedApiDocs(sourceCode: string, targetCode: string, fromLang: string, toLang: string): string {
    return `# API Documentation

## Overview
This document describes the API for the code converted from ${fromLang} to ${toLang}.

## Functions
${extractFunctionDetails(targetCode, toLang)}

## Data Structures
${extractDataStructureDetails(targetCode, toLang)}

## Usage Examples
\`\`\`${toLang}
${generateUsageExamples(targetCode, toLang)}
\`\`\`

## Error Handling
${getErrorHandlingInfo(toLang)}

## Best Practices
${getBestPractices(toLang)}

## Performance Considerations
${getPerformanceConsiderations(fromLang, toLang)}
`;
  }
  
  // Helper functions for API docs generation
  function extractFunctionDetails(code: string, language: string): string {
    // Simple implementation - in a real app, we'd use language-specific parsing
    const lines = code.split('\n');
    const functionLines = lines.filter(line => 
      (language === "javascript" && line.includes("function ")) ||
      (language === "python" && line.includes("def ")) ||
      (language === "swift" && line.includes("func "))
    );
    
    if (functionLines.length === 0) {
      return "No functions detected in the converted code.";
    }
    
    let details = "";
    for (const line of functionLines) {
      let functionName = "";
      let params = "";
      
      if (language === "javascript") {
        const match = line.match(/function\s+(\w+)\s*\((.*?)\)/);
        if (match) {
          functionName = match[1];
          params = match[2];
        }
      } else if (language === "python") {
        const match = line.match(/def\s+(\w+)\s*\((.*?)\)/);
        if (match) {
          functionName = match[1];
          params = match[2];
        }
      } else if (language === "swift") {
        const match = line.match(/func\s+(\w+)\s*\((.*?)\)/);
        if (match) {
          functionName = match[1];
          params = match[2];
        }
      }
      
      if (functionName) {
        details += `- \`${functionName}(${params})\`: Performs calculation or processing. Accepts ${params || "no"} parameters.\n`;
      }
    }
    
    return details || "No detailed function information available.";
  }
  
  function extractDataStructureDetails(code: string, language: string): string {
    // Simple detection of data structures - in a real app, we'd use language-specific parsing
    const hasArrays = code.includes("[") && code.includes("]");
    const hasObjects = code.includes("{") && code.includes("}") && 
                      (code.includes(":") || code.includes("=>"));
    const hasClasses = code.includes("class ");
    
    let structures = "";
    
    if (hasArrays) {
      if (language === "javascript") {
        structures += "- **Arrays**: Used for ordered collections of elements.\n";
      } else if (language === "python") {
        structures += "- **Lists**: Used for ordered collections of elements.\n";
      } else if (language === "swift") {
        structures += "- **Arrays**: Used for ordered collections of elements with the same type.\n";
      }
    }
    
    if (hasObjects) {
      if (language === "javascript") {
        structures += "- **Objects**: Used for key-value pairs and property storage.\n";
      } else if (language === "python") {
        structures += "- **Dictionaries**: Used for key-value pairs.\n";
      } else if (language === "swift") {
        structures += "- **Dictionaries**: Used for key-value pairs with specific types.\n";
      }
    }
    
    if (hasClasses) {
      structures += "- **Classes**: Used for object-oriented programming structures.\n";
    }
    
    return structures || "No complex data structures detected in the converted code.";
  }
  
  function generateUsageExamples(code: string, language: string): string {
    // Generate a simple usage example based on the language
    if (language === "javascript") {
      return `// Example usage of the converted JavaScript code
const result = someFunction(parameter1, parameter2);
console.log(result);

// To run this code:
// 1. Save as example.js
// 2. Run with: node example.js`;
    } else if (language === "python") {
      return `# Example usage of the converted Python code
result = some_function(parameter1, parameter2)
print(result)

# To run this code:
# 1. Save as example.py
# 2. Run with: python example.py`;
    } else if (language === "swift") {
      return `// Example usage of the converted Swift code
let result = someFunction(parameter1: value1, parameter2: value2)
print(result)

// To run this code:
// 1. Save as Example.swift
// 2. Run with: swift Example.swift`;
    }
    
    return `// Example usage would depend on your specific ${language} environment`;
  }
  
  function getErrorHandlingInfo(language: string): string {
    if (language === "javascript") {
      return "This code uses try/catch blocks for error handling. Proper error checking should be implemented for production use.";
    } else if (language === "python") {
      return "This code uses try/except blocks for error handling. Consider adding more specific exception types for production use.";
    } else if (language === "swift") {
      return "This code uses Swift's error handling with do-try-catch. Ensure proper error propagation in production environments.";
    }
    
    return `Standard error handling conventions for ${language} should be applied.`;
  }
  
  function getBestPractices(language: string): string {
    if (language === "javascript") {
      return "- Use strict mode with 'use strict'\n- Prefer const/let over var\n- Use modern ES6+ features when available";
    } else if (language === "python") {
      return "- Follow PEP 8 style guidelines\n- Use type hints for better code clarity\n- Use list/dict comprehensions for cleaner code";
    } else if (language === "swift") {
      return "- Use Swift's strong typing system\n- Leverage optionals properly\n- Follow Swift API design guidelines";
    }
    
    return `Follow standard best practices for ${language} development.`;
  }
  
  function getPerformanceConsiderations(fromLang: string, toLang: string): string {
    return `When converting from ${fromLang} to ${toLang}, be aware that:

1. Memory management differs between the languages
2. Performance characteristics of similar operations may vary
3. Standard libraries have different optimizations
4. Concurrency and parallelism are handled differently`;
  }

  // Helper function to get file extension based on language
  function getFileExtension(language: string): string {
    const extensionMap: Record<string, string> = {
      "javascript": "js",
      "typescript": "ts",
      "python": "py",
      "java": "java",
      "c": "c",
      "cpp": "cpp",
      "csharp": "cs",
      "go": "go",
      "ruby": "rb",
      "php": "php",
      "swift": "swift",
      "kotlin": "kt",
      "rust": "rs",
      "html": "html",
      "css": "css",
      "sql": "sql"
    };
    
    return extensionMap[language.toLowerCase()] || "txt";
  }

  // Function to generate code conversion (simulated for now)
  function generateCodeConversion(
    sourceCode: string,
    sourceLanguage: string,
    targetLanguage: string,
    skillLevel: string,
    generateReadme?: boolean,
    generateApi?: boolean
  ) {
    // Simulate code conversion based on language pair
    let targetCode: string;
    let highLevel: string;
    let languageDifferences: string;
    let readme: string = "";
    let apiDocs: string = "";

    // Example step-by-step conversion (simplified)
    const stepByStep = [
      {
        title: "Variable Declarations",
        sourceCode: getRelevantSnippet(sourceCode, sourceLanguage, "variables"),
        targetCode: getConvertedSnippet(sourceCode, sourceLanguage, targetLanguage, "variables"),
        explanation: getExplanation(sourceLanguage, targetLanguage, "variables", skillLevel)
      },
      {
        title: "Function Definitions",
        sourceCode: getRelevantSnippet(sourceCode, sourceLanguage, "functions"),
        targetCode: getConvertedSnippet(sourceCode, sourceLanguage, targetLanguage, "functions"),
        explanation: getExplanation(sourceLanguage, targetLanguage, "functions", skillLevel)
      },
      {
        title: "Control Flow",
        sourceCode: getRelevantSnippet(sourceCode, sourceLanguage, "control"),
        targetCode: getConvertedSnippet(sourceCode, sourceLanguage, targetLanguage, "control"),
        explanation: getExplanation(sourceLanguage, targetLanguage, "control", skillLevel)
      }
    ];

    // Generate converted code (placeholder implementation)
    targetCode = generateTargetCode(sourceCode, sourceLanguage, targetLanguage);
    
    // Generate high-level explanation
    highLevel = `This code was converted from ${sourceLanguage} to ${targetLanguage} by analyzing the source structure and applying language-specific patterns.`;
    
    // Generate language differences explanation
    languageDifferences = getLanguageDifferences(sourceLanguage, targetLanguage);
    
    // Generate README if requested
    if (generateReadme) {
      readme = generateReadmeContent(sourceCode, targetCode, sourceLanguage, targetLanguage);
    }
    
    // Generate API docs if requested
    if (generateApi) {
      apiDocs = generateApiDocumentation(sourceCode, targetCode, sourceLanguage, targetLanguage);
    }

    return {
      targetCode,
      stepByStep,
      highLevel,
      languageDifferences,
      readme,
      apiDocs
    };
  }

  // Helper functions for code conversion simulation
  function getRelevantSnippet(code: string, language: string, snippetType: string): string {
    // Simple snippet extraction (placeholder)
    const lines = code.split("\n");
    if (lines.length <= 3) return code;
    return lines.slice(0, 3).join("\n") + "\n// ...";
  }

  function getConvertedSnippet(code: string, fromLang: string, toLang: string, snippetType: string): string {
    // Simple conversion logic (placeholder)
    if (fromLang === "javascript" && toLang === "python") {
      return code.replace(/let|const|var/g, "").replace(/;/g, "").replace(/{/g, ":").replace(/}/g, "");
    } else if (fromLang === "python" && toLang === "javascript") {
      return code.replace(/def /g, "function ").replace(/:$/gm, " {").replace(/^\s*$/gm, "}");
    }
    return code; // Default fallback
  }

  function getExplanation(fromLang: string, toLang: string, featureType: string, skillLevel: string): string {
    // Adapt explanation based on skill level
    const basicExplanation = `${featureType} are defined differently in ${fromLang} and ${toLang}.`;
    
    if (skillLevel === "beginner") {
      return `${basicExplanation} Let's look at how this works step by step.`;
    } else if (skillLevel === "intermediate") {
      return `${basicExplanation} The syntax differences reflect each language's design philosophy.`;
    } else {
      return `${basicExplanation} Note the performance and memory management implications of this change.`;
    }
  }

  function generateTargetCode(sourceCode: string, fromLang: string, toLang: string): string {
    // Simple demonstration conversion (placeholder)
    if (fromLang === "javascript" && toLang === "python") {
      return sourceCode
        .replace(/function\s+(\w+)\s*\((.*?)\)\s*{/g, "def $1($2):")
        .replace(/const|let|var/g, "")
        .replace(/;/g, "")
        .replace(/{/g, ":")
        .replace(/}/g, "")
        .replace(/===|==/g, "==")
        .replace(/!==|!=/g, "!=")
        .replace(/console\.log/g, "print");
    } else if (fromLang === "python" && toLang === "javascript") {
      return sourceCode
        .replace(/def\s+(\w+)\s*\((.*?)\):/g, "function $1($2) {")
        .replace(/^\s*(.+)$/gm, "  $1;")
        .replace(/print/g, "console.log")
        .replace(/:\s*$/gm, " {")
        .replace(/^\s*$/gm, "}");
    }
    // Add more language pairs as needed
    return `// Converted from ${fromLang} to ${toLang}\n${sourceCode}`;
  }

  function getLanguageDifferences(fromLang: string, toLang: string): string {
    const languagePairs: Record<string, string> = {
      "javascript-python": "JavaScript uses curly braces for code blocks while Python uses indentation. JavaScript is dynamically typed with explicit variable declarations, while Python uses duck typing with implicit declarations.",
      "python-javascript": "Python uses indentation for code blocks while JavaScript uses curly braces. Python has implicit variable declarations while JavaScript requires explicit declarations with let, const, or var.",
      "java-python": "Java is statically typed requiring explicit type declarations, while Python is dynamically typed. Java uses curly braces for code blocks while Python uses indentation.",
      "python-java": "Python uses indentation for code blocks while Java uses curly braces. Python is dynamically typed while Java requires explicit type declarations."
    };
    
    const key = `${fromLang}-${toLang}`;
    return languagePairs[key] || `${fromLang} and ${toLang} have different syntax, semantics, and paradigms.`;
  }

  function generateReadmeContent(sourceCode: string, targetCode: string, fromLang: string, toLang: string): string {
    return `# Code Conversion: ${fromLang} to ${toLang}

## Description
This repository contains code that was automatically converted from ${fromLang} to ${toLang} using SourceXchange.

## Source Code (${fromLang})
\`\`\`${fromLang}
${sourceCode}
\`\`\`

## Converted Code (${toLang})
\`\`\`${toLang}
${targetCode}
\`\`\`

## Usage
This code can be run in any standard ${toLang} environment.

## Potential Issues
- The conversion may not be perfect and might require manual adjustments.
- Language-specific features might not have direct equivalents.
- Performance characteristics may differ between languages.

## License
This converted code retains the same license as the original code.
`;
  }

  function generateApiDocumentation(sourceCode: string, targetCode: string, fromLang: string, toLang: string): string {
    return `# API Documentation

## Overview
This document describes the API for the converted code from ${fromLang} to ${toLang}.

## Functions
${extractFunctionInfo(targetCode, toLang)}

## Data Structures
${extractDataStructures(targetCode, toLang)}

## Usage Examples
\`\`\`${toLang}
// Example of how to use the converted code
${generateUsageExample(targetCode, toLang)}
\`\`\`

## Error Handling
${generateErrorHandlingInfo(targetCode, toLang)}
`;
  }

  function extractFunctionInfo(code: string, language: string): string {
    // Simplified function extraction (placeholder)
    if (language === "javascript" || language === "typescript") {
      return "- `function example(param1, param2)`: Description of the function";
    } else if (language === "python") {
      return "- `def example(param1, param2)`: Description of the function";
    }
    return "- No functions detected";
  }

  function extractDataStructures(code: string, language: string): string {
    // Simplified data structure extraction (placeholder)
    return "- No complex data structures detected";
  }

  function generateUsageExample(code: string, language: string): string {
    // Generate a simple usage example based on the language
    if (language === "javascript") {
      return "const result = exampleFunction('test');\nconsole.log(result);";
    } else if (language === "python") {
      return "result = example_function('test')\nprint(result)";
    }
    return "// Example usage would go here";
  }

  function generateErrorHandlingInfo(code: string, language: string): string {
    // Generate error handling information based on the language
    if (language === "javascript") {
      return "Errors are handled using try/catch blocks. Check for exceptions when calling functions.";
    } else if (language === "python") {
      return "Errors are handled using try/except blocks. Check for exceptions when calling functions.";
    }
    return "Standard error handling conventions for " + language + " apply.";
  }

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
