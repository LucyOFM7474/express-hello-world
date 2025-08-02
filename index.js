const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;
    
    const prompt = `Realizează o analiză în 10 puncte pentru meciul ${question}.
    Include informații despre forma echipelor, statistici, jucători importanți, tactici, scor estimat și recomandări de pariu.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la procesarea întrebării" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serverul rulează pe portul ${PORT}`));
