const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

const app = express();

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("AI Backend Server is Running!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from Express Backend!"
    });
});

// Gemini AI Chat API

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        // Validate conversation history
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please provide conversation messages."
            });
        }

        // Convert messages into Gemini format
        const conversation = messages.slice(-20).map((msg) => ({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.text }]
        }));

        // Send conversation history to Gemini
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",

            config: {
                systemInstruction: `
            You are a professional HRMS assistant.

            Your responsibilities:
            - Explain HR management concepts.
            - Explain employee attendance and leave management.
            - Explain payroll and salary calculations.
            - Help with employee management questions.

            Guidelines:
            - Use simple and clear English.
            - Give practical examples.
            - Keep answers structured.
            - Be polite and professional.
        `
            },

            contents: conversation
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error("Gemini API Error:", error);

        res.status(500).json({
            error: "Failed to generate AI response."
        });
    }
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
