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
    
    // Use GEMINI_API_KEY for Netlify deployment, fallback to API_KEY just in case
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: "API key not configured" }) 
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are the digital representative for Apostle Sunday Iyi.
If someone asks a spiritual question, check if there is a related video on his YouTube channel and provide the link.
The Rule: If you don't have a specific video link for their question, say: 'I don't have a specific video on that yet, but Apostle Sunday Iyi would love to hear from you directly. You can message him here: https://Apostlesundayiyi.netlify.app/contact'`;

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
