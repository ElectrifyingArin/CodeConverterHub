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
      const { sourceLanguage, targetLanguage } = validatedData;

      console.log(`Converting from ${sourceLanguage} to ${targetLanguage} using OpenAI GPT-4o`);
      
      // Generate a unique ID for tracking this conversion request
      const requestId = `request_${Date.now()}`;
      
      try {
        // Call OpenAI API to perform the code conversion
        const result = await convertCodeWithOpenAI(validatedData);
        
        // Log successful conversion
        console.log(`Successfully processed conversion request with ID: ${requestId}`);
        
        // Save the conversion to storage (optional)
        // Can be implemented later to track user history
        
        // Send the response
        res.json(result);
      } catch (openAiError) {
        console.error("OpenAI API error:", openAiError);
        
        // Fallback to the simulated conversion if OpenAI fails
        console.log("Falling back to simulated conversion due to API error");
        
        // Generate the converted code using the fallback implementation
        const fallbackResult = generateCodeConversion(
          validatedData.sourceCode,
          validatedData.sourceLanguage,
          validatedData.targetLanguage,
          validatedData.skillLevel,
          validatedData.generateReadme,
          validatedData.generateApi
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
        if (validatedData.generateReadme) {
          result.readme = fallbackResult.readme;
        }

        if (validatedData.generateApi) {
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
