
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Stack
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage }
    ]);

    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: "user", text: userMessage }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.reply }
      ]);

    } catch (err) {
      setError(err.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 750,
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#082a4d",
            color: "white",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          <Avatar sx={{ bgcolor: "white", color: "#082a4d" }}>
            <SmartToyIcon />
          </Avatar>

          <Box>
            <Typography variant="h6">
              AI Assistant
            </Typography>

            <Typography variant="caption">
              Powered by Gemini
            </Typography>
          </Box>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {messages.length === 0 && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary"
              }}
            >
              <SmartToyIcon sx={{ fontSize: 55, mb: 1 }} />

              <Typography variant="h6">
                How can I help you today?
              </Typography>

              <Typography variant="body2">
                Ask me anything to get started.
              </Typography>
            </Box>
          )}

          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start"
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: "80%",
                  borderRadius: 2,
                  bgcolor:
                    msg.role === "user" ? "#dbeafe" : "#f1f5f9"
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {msg.role === "user" ? "You" : "Gemini"}
                </Typography>

                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          ))}

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Gemini is thinking...
              </Typography>
            </Stack>
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: 1
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !input.trim()}
            endIcon={<SendIcon />}
            sx={{
              bgcolor: "#082a4d",
              px: 3,
              "&:hover": {
                bgcolor: "#10416e"
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;
