import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      // Use GEMINI_API_KEY for AI Studio, fallback to API_KEY for Netlify deployment
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are a helpful chat assistant representing Apostle Sunday Iyi. 
Your goal is to assist visitors with their inquiries.
If a visitor asks about a specific topic, try to provide a relevant YouTube link from his channel.
If there is no specific video or you don't know the answer, politely tell them to contact the Apostle directly at https://Apostlesundayiyi.netlify.app/contact.
Keep your responses concise, respectful, and aligned with Christian teachings.`;

      // Format history for the model
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      // Add the current message
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

      res.json({ text: response.text });
    } catch (error) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
