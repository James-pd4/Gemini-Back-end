import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configuração do Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware para interpretar JSON
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "Servidor está funcionando!" });
  });
  
// Rota para processar perguntas
app.post("/api/prompt", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "O campo 'prompt' é obrigatório!" });
  }

  try {
    // Envia o prompt para o modelo Gemini
    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash", // Modelo usado
      contents: prompt, // Prompt recebido do cliente
    });

    let fullResponse = "";

    // Concatena as partes da resposta gerada
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    // Retorna a resposta completa ao cliente
    res.json({ response: fullResponse });
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error.message);
    res.status(500).json({ error: "Erro ao processar o prompt." });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
