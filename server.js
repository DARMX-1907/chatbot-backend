import express from "express";
import fetch from "node-fetch";
import cors from "cors";

console.log("API KEY:", process.env.GEMINI_API_KEY);
console.log("Request masuk");
const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyCkS2iGGfXEiJ0XuRIom0xZYvm_JNz43GI";

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: userMessage }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("GEMINI RESPONSE:", data); // debug

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI tidak merespon";

        res.json({ reply });

    } catch (error) {
        console.error(error);
        res.json({ reply: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});
