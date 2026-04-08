import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// ✅ CORS yang benar — izinkan semua domain
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ reply: "API Key tidak ditemukan!" });
        }

        const userMessage = req.body.message;
        console.log("Pesan masuk:", userMessage);

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            }
        );

        const data = await response.json();
        console.log("GEMINI RESPONSE:", JSON.stringify(data));

        if (data.error) {
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
    console.log("API KEY tersedia:", !!process.env.GEMINI_API_KEY);
