import express from "express";
import bodyParser from "body-parser";
import path from "path";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 10000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(bodyParser.json());
app.use(express.static(path.resolve("./public")));

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.json({ reply: "Nu ai introdus nicio întrebare." });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Ești LucyOFM Bot și răspunzi clar, în 10 puncte, fără contradicții." },
        { role: "user", content: question }
      ]
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "Eroare la conectarea cu GPT‑4o." });
  }
});

app.listen(port, () => console.log(`LucyOFM Bot rulează pe portul ${port}`));
