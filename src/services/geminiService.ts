import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateContent = async (prompt: string, systemInstruction: string) => {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model: model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
  return response.text;
};

export const generateContentStream = async (prompt: string, systemInstruction: string, tools?: any) => {
  const model = "gemini-3-flash-preview";
  return ai.models.generateContentStream({
    model: model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      tools: tools,
    },
  });
};
