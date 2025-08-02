const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

// Inițializăm aplicația
dotenv.config();
const app = express();
app.use(bodyParser.json());

// Servim fișierele statice din folderul public
app.use(express.static(path.join(__dirname, "public")));

// Endpoint pentru întrebări
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: question }],
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Eroare la procesarea întrebării. Verifică cheia API." });
  }
});

// La accesarea "/": trimitem fișierul index.html din public
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Pornim serverul
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`Serverul rulează pe portul ${PORT}`)
);
