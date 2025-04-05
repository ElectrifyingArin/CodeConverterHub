import OpenAI from "openai";
import { ConvertCodeRequest, ConvertCodeResponse } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Main function to convert code using OpenAI's GPT-4o model
export async function convertCodeWithOpenAI(
  request: ConvertCodeRequest
): Promise<ConvertCodeResponse> {
  const { sourceCode, sourceLanguage, targetLanguage, skillLevel, generateReadme, generateApi } = request;

  try {
    // Prepare system prompt with instructions
    const systemPrompt = `You are an expert code converter specializing in translating code between programming languages.
Your task is to convert code from ${sourceLanguage} to ${targetLanguage}.
Provide detailed explanations appropriate for a ${skillLevel} level programmer.
Follow these steps:
1. Analyze the source code structure and functionality
2. Convert to the target language while maintaining functionality
3. Explain key differences between languages
4. Provide step-by-step breakdown of the conversion process`;

    // Create the prompt for the user message
    let userPrompt = `Convert this ${sourceLanguage} code to ${targetLanguage}:\n\n\`\`\`${sourceLanguage}\n${sourceCode}\n\`\`\`\n\n`;
    
    // Add additional requirements based on user's request
    if (generateReadme) {
      userPrompt += "Also generate a README.md file that explains how to use the converted code.\n";
    }
    
    if (generateApi) {
      userPrompt += "Also generate API documentation for the converted code.\n";
    }
    
    userPrompt += `Respond in JSON format with the following structure:
{
  "targetCode": "The full converted code",
  "explanation": {
    "stepByStep": [
      {
        "title": "Step title",
        "sourceCode": "Relevant source code snippet",
        "targetCode": "Converted code snippet",
        "explanation": "Detailed explanation of this step"
      }
    ],
    "highLevel": "High-level overview of the conversion",
    "languageDifferences": "Key differences between the languages"
  }${generateReadme ? ',\n  "readme": "Complete README.md content"' : ''}${generateApi ? ',\n  "apiDocs": "Complete API documentation"' : ''}
}`;

    // Call OpenAI API with chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more deterministic results
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content || "";
    const result = JSON.parse(content) as ConvertCodeResponse;
    
    return result;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to convert code: ${(error as Error).message}`);
  }
}