import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 10000;

// Endpoint pentru pagina principală
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>LucyOFM Bot</title>
      </head>
      <body style="font-family: Arial; background: #f5f5f5; text-align: center; padding-top: 50px;">
        <h1>LucyOFM Bot</h1>
        <form id="chat-form">
          <textarea id="message" placeholder="Scrie mesajul aici..." style="width: 300px; height: 100px;"></textarea><br><br>
          <button type="submit">Trimite</button>
        </form>
        <div id="response" style="margin-top: 20px; white-space: pre-line;"></div>
        <script>
          const form = document.getElementById("chat-form");
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const message = document.getElementById("message").value;
            const res = await fetch("/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message })
            });
            const data = await res.json();
            document.getElementById("response").innerText = data.reply;
          });
        </script>
      </body>
    </html>
  `);
});

// Endpoint pentru chat
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Ești un asistent personal numit LucyOFM Bot. Răspunde clar și detaliat la întrebările utilizatorului." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Eroare la generarea răspunsului.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Eroare de conexiune cu serverul OpenAI." });
  }
});

app.listen(PORT, () => console.log(`Botul rulează pe portul ${PORT}`));
