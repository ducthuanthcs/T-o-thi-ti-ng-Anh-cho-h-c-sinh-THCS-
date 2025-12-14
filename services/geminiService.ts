import { GoogleGenAI } from "@google/genai";
import { ASSESSMENT_MATRIX_PROMPT } from "../constants";

export const generateAssessment = async (
  apiKey: string,
  grade: string,
  topic: string,
  contextText: string,
  writingTopic: string,
  difficulty: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Determine writing prompt. If user didn't provide one, default to main topic.
  const specificWritingTopic = writingTopic && writingTopic.trim().length > 0 
    ? writingTopic 
    : `a topic related to ${topic}`;

  // Interpolate the prompt
  const finalPrompt = ASSESSMENT_MATRIX_PROMPT
    .replace('${grade}', grade)
    .replace('${topic}', topic)
    .replace('${difficulty}', difficulty)
    .replace('${writingTopic}', specificWritingTopic)
    .replace('${context}', contextText ? contextText.substring(0, 20000) : "No specific context provided, use general knowledge related to the topic.");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        // High budget for thinking to ensure strict adherence to the complex matrix structure
        thinkingConfig: { thinkingBudget: 1024 }, 
        temperature: 0.4, // Lower temperature for more structured/academic output
      }
    });

    if (!response.text) {
      throw new Error("No content generated.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};