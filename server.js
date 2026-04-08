import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyCkS2iGGfXEiJ0XuRIom0xZYvm_JNz43GI";

app.post("/chat", async (req, res) => {
    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: req.body.message }]
                    }]
                })
            }
        );

        const data = await response.json();

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respon";

        res.json({ reply });

    } catch (err) {
        res.json({ reply: "Error server" });
    }
});

app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});
