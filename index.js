import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Răspuns de test (verifică dacă merge)
app.get("/", (req, res) => {
  res.send("BOT LucyOFM activ și conectat la GPT-4o!");
});

// Endpoint pentru întrebări
app.post("/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Lipsește întrebarea!" });
    }

    // Trimite cererea la OpenAI GPT-4o
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Ești BOT-ul personal LucyOFM." },
          { role: "user", content: question }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.json({ answer: botReply });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Eroare BOT GPT-4o." });
  }
});

// Pornește serverul pe portul Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`BOT LucyOFM rulează pe portul ${PORT}`));

