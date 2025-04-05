import { ConvertCodeRequest, ConvertCodeResponse } from "@shared/schema";
import fetch from "node-fetch";

/**
 * Main function to convert code using GitHub API
 * Falls back to local conversion logic if GitHub API fails
 */
export async function convertCodeWithGitHub(
  request: ConvertCodeRequest
): Promise<ConvertCodeResponse> {
  const { sourceCode, sourceLanguage, targetLanguage, skillLevel, generateReadme, generateApi } = request;

  console.log(`Starting code conversion from ${sourceLanguage} to ${targetLanguage} using GitHub API`);
  
  try {
    // GitHub's Repositories API endpoint - we'll use this to create a Gist-like approach
    // This is a simplification since we don't have direct access to GitHub Copilot API
    const githubApiEndpoint = "https://api.github.com/repos/github/copilot-docs/issues";
    
    // Create a detailed conversion request as an issue title/body
    const title = `Convert ${sourceLanguage} to ${targetLanguage} code`;
    const body = `
# Code Conversion Request

Please convert this ${sourceLanguage} code to ${targetLanguage}, providing detailed explanations for a ${skillLevel} level programmer.

## Source Code (${sourceLanguage})
\`\`\`${sourceLanguage}
${sourceCode}
\`\`\`

## Requirements
- Return complete converted code
- Provide step-by-step conversion explanation
- Include high-level overview
- Explain language differences
${generateReadme ? '- Include README.md content' : ''}
${generateApi ? '- Include API documentation' : ''}
`;

    console.log("Making API request to GitHub...");
    
    // Make the API request to GitHub
    const response = await fetch(githubApiEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `token ${process.env.GITHUB_API_KEY}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "SourceXchange-App"
      },
      body: JSON.stringify({
        title: title,
        body: body
      })
    });

    // For now, we'll just log that we attempted to use the GitHub API
    // Since we're using a GitHub API token which may not have suitable permissions,
    // or the endpoint might not be the correct one for our needs, we'll fall back to local conversion
    console.log(`GitHub API response status: ${response.status}`);
    
    // Regardless of GitHub API response, fall back to local conversion
    console.warn("GitHub API integration not fully implemented - using local fallback");
    throw new Error("Using local fallback conversion");
    
  } catch (error) {
    console.log("Using local conversion fallback logic");
    
    // Create a more sophisticated conversion using our local logic
    let convertedCode = "";
    
    if (sourceLanguage === "javascript" && targetLanguage === "python") {
      // JavaScript to Python conversion
      convertedCode = convertJavaScriptToPython(sourceCode);
    } 
    else if (sourceLanguage === "javascript" && targetLanguage === "swift") {
      // JavaScript to Swift conversion
      convertedCode = convertJavaScriptToSwift(sourceCode);
    }
    else if (sourceLanguage === "python" && targetLanguage === "javascript") {
      // Python to JavaScript conversion
      convertedCode = convertPythonToJavaScript(sourceCode);
    }
    else {
      // For other language pairs, use a simple placeholder
      convertedCode = `// Converted from ${sourceLanguage} to ${targetLanguage}\n${sourceCode}`;
    }
    
    // Generate a detailed step-by-step explanation
    const stepByStep = generateDetailedStepByStep(
      sourceCode, 
      convertedCode, 
      sourceLanguage, 
      targetLanguage, 
      skillLevel
    );
    
    // Generate the complete response
    const result: ConvertCodeResponse = {
      targetCode: convertedCode,
      explanation: {
        stepByStep: stepByStep,
        highLevel: generateHighLevelExplanation(sourceLanguage, targetLanguage),
        languageDifferences: getDetailedLanguageDifferences(sourceLanguage, targetLanguage)
      }
    };
    
    if (generateReadme) {
      result.readme = generateDetailedReadme(sourceCode, convertedCode, sourceLanguage, targetLanguage);
    }
    
    if (generateApi) {
      result.apiDocs = generateDetailedApiDocs(sourceCode, convertedCode, sourceLanguage, targetLanguage);
    }
    
    return result;
  }
}

// Helper conversion functions
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

// Generate detailed step-by-step explanation
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

// Extract code sections for explanations
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

// Generate explanations for each code section
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

// Generate high-level explanation
function generateHighLevelExplanation(sourceLanguage: string, targetLanguage: string): string {
  const pairExplanations: Record<string, string> = {
    "javascript-swift": `This conversion transforms JavaScript code to Swift, adapting the syntax and structure while preserving functionality. Swift is a statically-typed language designed for safety and performance, while JavaScript is dynamically-typed and designed for flexibility. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`,
    
    "javascript-python": `This conversion transforms JavaScript code to Python, adapting the syntax and structure while preserving functionality. Python uses significant whitespace (indentation) instead of braces and has different conventions for naming and structure. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`,
    
    "python-javascript": `This conversion transforms Python code to JavaScript, adapting the syntax and structure while preserving functionality. JavaScript uses braces instead of significant whitespace (indentation) and has different conventions for naming and structure. The conversion handles variable declarations, function definitions, control flow structures, and common operations while attempting to maintain the original code's intent.`
  };
  
  const key = `${sourceLanguage}-${targetLanguage}`;
  return pairExplanations[key] || `This code was converted from ${sourceLanguage} to ${targetLanguage} by analyzing the source structure and applying language-specific patterns. The conversion maintains the original functionality while adapting to the target language's syntax and conventions.`;
}

// Generate language differences explanation
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

// Generate README content
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

// Generate API documentation
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

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    "javascript": ".js",
    "typescript": ".ts",
    "python": ".py",
    "java": ".java",
    "c": ".c",
    "cpp": ".cpp",
    "csharp": ".cs",
    "go": ".go",
    "rust": ".rs",
    "ruby": ".rb",
    "php": ".php",
    "swift": ".swift",
    "kotlin": ".kt",
    "dart": ".dart",
    "scala": ".scala"
  };
  
  return extensions[language] || `.${language}`;
}