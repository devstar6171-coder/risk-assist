import { GoogleGenAI, Type } from '@google/genai';
import { RiskItem, RiskCategory } from '../types';

// Initialize the SDK. Assumes process.env.API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const riskSchema = {
  type: Type.ARRAY,
  description: "A list of identified risks based on the project description.",
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "A unique alphanumeric ID for the risk (e.g., RSK-001)" },
      title: { type: Type.STRING, description: "Short, descriptive title of the risk" },
      description: { type: Type.STRING, description: "Detailed explanation of the risk context" },
      category: { 
        type: Type.STRING, 
        description: `Must be exactly one of: ${Object.values(RiskCategory).join(', ')}` 
      },
      vulnerabilities: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Specific technical, operational, or financial vulnerabilities"
      },
      mitigations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING, description: "Actionable mitigation strategy" },
            costScore: { type: Type.INTEGER, description: "Score from 1 (Low Cost) to 10 (High Cost)" },
            complexityScore: { type: Type.INTEGER, description: "Score from 1 (Simple) to 10 (Highly Complex)" },
            timeScore: { type: Type.INTEGER, description: "Score from 1 (Immediate) to 10 (Long-term)" }
          },
          required: ["strategy", "costScore", "complexityScore", "timeScore"]
        }
      }
    },
    required: ["id", "title", "description", "category", "vulnerabilities", "mitigations"]
  }
};

export const analyzeProjectText = async (text: string): Promise<RiskItem[]> => {
  try {
    const prompt = `
      You are the Frontier AI Risk Engine (FAIRE), an expert military and defence risk analyst.
      Analyze the following project description and identify potential risks.
      
      Project Description:
      ---
      ${text}
      ---
      
      Perform contextual deep parsing to identify structural, semantic, and syntax vulnerabilities.
      Cross-reference with standard defence taxonomies.
      Generate a comprehensive risk profile.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a strict JSON data generator. Only output valid JSON matching the requested schema. Do not include markdown formatting like ```json.",
        responseMimeType: 'application/json',
        responseSchema: riskSchema,
        temperature: 0.2, // Lower temperature for more deterministic, analytical output
      }
    });

    const jsonStr = response.text.trim();
    const parsedData = JSON.parse(jsonStr);
    
    // Map the parsed data to ensure it matches our internal state structure
    return parsedData.map((item: any) => ({
      ...item,
      status: 'active' // Initialize all new risks as active
    }));

  } catch (error) {
    console.error("Error analyzing project text with Gemini:", error);
    throw new Error("Failed to generate risk profile. Please check API configuration and input data.");
  }
};
