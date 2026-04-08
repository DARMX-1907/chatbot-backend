import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ reply: "API Key tidak ditemukan!" });
        }

        const userMessage = req.body.message;
        console.log("Pesan masuk:", userMessage);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const result = await response.json();
        console.log("GROQ RESPONSE:", JSON.stringify(result));

        if (result.error) {
            return res.json({ reply: "Error: " + result.error.message });
        }

        const reply = result.choices?.[0]?.message?.content || "AI tidak merespon";
        res.json({ reply });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ reply: "Server error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ Server jalan di port " + PORT);
    console.log("API KEY tersedia:", !!API_KEY);
});
