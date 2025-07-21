
import { GoogleGenAI } from "@google/genai";

export const explainWithAi = async (apiKey: string, concept: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API key is not set.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert in Quantum Computing and Satellite Networking. Explain the following concept in a simple, easy-to-understand way for a student who is new to the field. Use analogies where possible. Keep the explanation concise and clear.

Concept: "${concept}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while explaining with AI: ${error.message}`;
    }
    return "An unknown error occurred while explaining with AI.";
  }
};
