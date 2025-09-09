import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function humanizeText(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Please humanize the following AI-generated text to make it sound more natural and human-like. Maintain the original meaning and structure while making it more conversational and natural. Here's the text:

${text}

Humanized version:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to humanize text');
  }
}
