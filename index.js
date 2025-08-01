import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

// Inițializăm clientul OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Pagina principală – formular întrebări
app.get("/", (req, res) => {
  res.send(`
    <h1>LucyOFM Bot GPT-4o</h1>
    <form method="POST" action="/ask">
      <textarea name="question" rows="4" cols="50" placeholder="Pune întrebarea aici..."></textarea><br>
      <button type="submit">Trimite</button>
    </form>
  `);
});

// Endpoint pentru întrebări
app.post("/ask", express.urlencoded({ extended: true }), async (req, res) => {
  const question = req.body.question;
  if (!question) {
    return res.send("Te rog să pui o întrebare!");
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: question
    });

    res.send(`
      <h1>Întrebarea ta:</h1>
      <p>${question}</p>
      <h2>Răspuns GPT-4o:</h2>
      <p>${response.output_text}</p>
      <a href="/">Pune altă întrebare</a>
    `);
  } catch (error) {
    res.send("Eroare la generarea răspunsului: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});
