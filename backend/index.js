
const express = require("express");
const cors = require("cors");
const { GoogleGenAI, Type } = require("@google/genai");

require("dotenv").config();

const app = express();

// Sample employee data
const employees = [
    {
        id: 1,
        name: "Rahul Sharma",
        department: "IT",
        designation: "Software Developer",
        status: "Present"
    },
    {
        id: 2,
        name: "Priya Reddy",
        department: "HR",
        designation: "HR Executive",
        status: "Absent"
    },
    {
        id: 3,
        name: "Amit Kumar",
        department: "Finance",
        designation: "Accountant",
        status: "Present"
    },
    {
        id: 4,
        name: "Sneha Patel",
        department: "IT",
        designation: "Frontend Developer",
        status: "On Leave"
    }
];

// Get employees by department
function getEmployeesByDepartment(department) {
    return employees.filter(
        employee =>
            employee.department.toLowerCase() === department.toLowerCase()
    );
}

// Get employees by status
function getEmployeesByStatus(status) {
    return employees.filter(
        employee =>
            employee.status.toLowerCase() === status.toLowerCase()
    );
}

// Function declaration for Gemini
const tools = [
    {
        functionDeclarations: [
            {
                name: "getEmployeesByDepartment",
                description: "Get all employees belonging to a specific department.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        department: {
                            type: Type.STRING,
                            description: "The department name, such as IT, HR, or Finance."
                        }
                    },
                    required: ["department"]
                }
            },
            {
                name: "getEmployeesByStatus",
                description: "Get all employees with a specific attendance status.",
                parameters: {
                    type: Type.OBJECT,
                    properties: {
                        status: {
                            type: Type.STRING,
                            description: "The employee status, such as Present, Absent, or On Leave."
                        }
                    },
                    required: ["status"]
                }
            }
        ]
    }
];

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Model configuration
const MODEL = "gemini-3.1-flash-lite";

// Maximum input token budget
const MAX_INPUT_TOKENS = 4000;

// Maximum conversation messages
const MAX_HISTORY = 20;

// System instruction
const SYSTEM_INSTRUCTION = `
You are a helpful and professional AI assistant integrated into an HRMS application.

Your responsibilities:
- Answer general questions across different topics.
- Help users with HRMS topics such as employee management,
  attendance, leave, payroll, recruitment, and onboarding.
- Suggest ways AI can improve HRMS workflows when relevant.

Response guidelines:
1. Understand the user's actual question before answering.
2. Answer the question directly.
3. Do not assume every question is related to HRMS.
4. Do not force an HRMS connection into unrelated questions.
5. If a question is ambiguous, ask a short clarifying question.
6. If the user corrects a misunderstanding, acknowledge it briefly.
7. Use simple, natural English.
8. Give practical examples when useful.
9. Keep answers concise unless the user asks for detail.
10. Be polite and professional.
11. Never invent company policies or employee records.
12. Clearly communicate when actual application data is unavailable.

Important:
- Use available function calls to retrieve employee data when answering employee-related questions.
- Never invent employee records or details.
- If the required information is unavailable, clearly say so.
- The employee data currently available is sample data, not live company data.
`;

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

// Get all employees
app.get("/api/employees", (req, res) => {
    res.json({
        success: true,
        count: employees.length,
        employees: employees
    });
});

// Gemini AI Chat API
app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        // Step 1: Validate conversation history
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Please provide conversation messages."
            });
        }

        // Step 2: Validate individual messages
        const isValid = messages.every((msg) =>
            msg &&
            ["user", "ai"].includes(msg.role) &&
            typeof msg.text === "string" &&
            msg.text.trim() !== ""
        );

        if (!isValid) {
            return res.status(400).json({
                error: "Invalid message format."
            });
        }

        // Step 3: Validate conversation sequence
        for (let i = 0; i < messages.length; i++) {
            const expectedRole = i % 2 === 0 ? "user" : "ai";

            if (messages[i].role !== expectedRole) {
                return res.status(400).json({
                    error: "Conversation messages must alternate between user and AI."
                });
            }
        }

        // Step 4: Apply message history limit
        let recentMessages = messages.slice(-MAX_HISTORY);

        // Ensure conversation starts with a user message
        if (recentMessages[0].role === "ai") {
            recentMessages = recentMessages.slice(1);
        }

        // Step 5: Convert messages into Gemini format
        let conversation = recentMessages.map((msg) => ({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.text }]
        }));


        // Step 6: Count tokens and manage conversation history
        let tokenCount = await ai.models.countTokens({
            model: MODEL,
            contents: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_INSTRUCTION }]
                },
                ...conversation
            ]
        });

        // Remove oldest complete question-answer pairs
        while (
            tokenCount.totalTokens > MAX_INPUT_TOKENS &&
            conversation.length > 1
        ) {
            conversation.splice(0, 2);

            tokenCount = await ai.models.countTokens({
                model: MODEL,
                contents: [
                    {
                        role: "user",
                        parts: [{ text: SYSTEM_INSTRUCTION }]
                    },
                    ...conversation
                ]
            });
        }

        // Step 7: Reject oversized individual messages
        if (tokenCount.totalTokens > MAX_INPUT_TOKENS) {
            return res.status(413).json({
                error: "Your message is too long. Please shorten it."
            });
        }

        // Display token information
        console.log(
            "Input Tokens (including system instruction):",
            tokenCount.totalTokens
        );

        console.log(
            "Messages sent to Gemini:",
            conversation.length
        );

        // Step 8: Send conversation to Gemini
        const response = await ai.models.generateContent({
            model: MODEL,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                tools: tools
            },
            contents: conversation
        });

        // Check whether Gemini requested a function
        const functionCalls = response.functionCalls;

        console.log("Function Calls:", functionCalls);

        // Step 9: Send function result back to Gemini
        let finalResponse = response;

        if (functionCalls && functionCalls.length > 0) {
            const functionCall = functionCalls[0];

            // Execute the requested backend function
            let result;

            if (functionCall.name === "getEmployeesByDepartment") {
                result = getEmployeesByDepartment(
                    functionCall.args.department
                );
            }
            else if (functionCall.name === "getEmployeesByStatus") {
                result = getEmployeesByStatus(
                    functionCall.args.status
                );
            }
            else {
                throw new Error(`Unsupported function: ${functionCall.name}`);
            }

            console.log("Function Result:", result);

            // Prepare function response
            const functionResponse = {
                functionResponse: {
                    name: functionCall.name,
                    id: functionCall.id,
                    response: {
                        output: result
                    }
                }
            };

            // Send function result back to Gemini
            finalResponse = await ai.models.generateContent({
                model: MODEL,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    tools: tools
                },
                contents: [
                    ...conversation,
                    response.candidates[0].content,
                    {
                        role: "user",
                        parts: [functionResponse]
                    }
                ]
            });
        }

        // Return AI response
        res.json({
            reply: finalResponse.text
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
