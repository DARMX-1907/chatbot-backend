import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ambil dari environment variable Railway, BUKAN hardcode
const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        // Cek API key tersedia
        if (!API_KEY) {
            return res.status(500).json({ reply: "API Key tidak ditemukan di environment variable!" });
        }

        const userMessage = req.body.message;
        console.log("Pesan masuk:", userMessage);

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.GROQ_API_KEY
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [{ role: "user", content: userMessage }]
                })
            });

const data = await response.json();
const reply = data.choices[0].message.content;

        const data = await response.json();
        console.log("GEMINI RESPONSE:", JSON.stringify(data));

        // Cek jika Gemini mengembalikan error
        if (data.error) {
            console.error("Gemini error:", data.error);
            return res.json({ reply: "Gemini error: " + data.error.message });
        }

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI tidak merespon";
        res.json({ reply });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ reply: "Server error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ Server jalan di port " + PORT);
    console.log("API KEY tersedia:", !!process.env.GEMINI_API_KEY); // true/false, tidak print key-nya
});
