
import { GoogleGenAI, GenerateContentResponse, Modality } from '@google/genai';
import { decode } from './audioUtils';

// Initialize the Google GenAI client
// The API key is automatically managed by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Updated the history parameter type to match the Gemini API's expected format and to enable conversational context.
export const getAIResponse = async (history: { role: string, parts: { text: string }[] }[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-pro',
      // FIX: Passed the chat history to maintain conversation context.
      history: history,
      config: {
        systemInstruction: 'You are Balanced Bowl\'s friendly and knowledgeable cooking assistant. Provide helpful, concise, and encouraging answers to questions about recipes, cooking techniques, ingredients, and meal planning. Keep your tone light and positive.',
      },
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm sorry, I'm having a little trouble in the kitchen right now. Please try again in a moment.";
  }
};

export const getTextToSpeech = async (text: string): Promise<string | null> => {
  if (!text) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      // FIX: Removed "Say: " prefix which would otherwise be read aloud by the model.
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};
