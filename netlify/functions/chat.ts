import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event) => {
  // Add CORS headers to allow cross-origin requests if needed
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { message, history } = body;
    
    // Use API_KEY for Netlify deployment, fallback to GEMINI_API_KEY for local preview
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: "API key not configured" }) 
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are a helpful chat assistant representing Apostle Sunday Iyi. 
Your goal is to assist visitors with their inquiries.
If a visitor asks about a specific topic, try to provide a relevant YouTube link from his channel.
If there is no specific video or you don't know the answer, politely tell them to contact the Apostle directly at https://Apostlesundayiyi.netlify.app/contact.
Keep your responses concise, respectful, and aligned with Christian teachings.`;

    const contents = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) || [];
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: response.text })
    };
  } catch (error) {
    console.error("Chat API Error:", error);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: "Failed to generate response" }) 
    };
  }
};
