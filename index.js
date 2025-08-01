import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 10000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("BOT-ul LucyOFM este ONLINE!");
});

app.get("/chat", async (req, res) => {
  const mesaj = req.query.mesaj || "Salut!";
  
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: mesaj }]
    });
    
    res.json({ raspuns: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ eroare: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});
