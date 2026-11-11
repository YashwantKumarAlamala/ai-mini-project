import React, { useState, useRef, useEffect } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
  Chip,
  Tooltip
} from "@mui/material";

import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

// Company Logo
import logo from "../components/bglogo.jpg";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Welcome screen state
  const [showIntro, setShowIntro] = useState(true);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 1900);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (chatBody) {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, loading]);

  const suggestions = [
    {
      title: "Employee Directory",
      description: "Explore employees by department",
      question: "Show me all employees in the IT department.",
      icon: <GroupsRoundedIcon />,
      color: "#5269d9"
    },
    {
      title: "Attendance Overview",
      description: "Check today's attendance",
      question: "How many employees are absent today? Give me their names.",
      icon: <EventAvailableRoundedIcon />,
      color: "#078eae"
    }
  ];

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setError("");
  };

  const handleSubmit = async (e, suggestedQuestion) => {
    if (e) e.preventDefault();

    const userMessage = (suggestedQuestion || input).trim();

    if (!userMessage || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", text: userMessage }
    ];

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
            messages: updatedMessages
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      if (!data.reply || typeof data.reply !== "string") {
        throw new Error("Invalid response received from AI.");
      }

      setMessages([
        ...updatedMessages,
        { role: "ai", text: data.reply }
      ]);

      setInput("");

    } catch (err) {
      console.error("Chat API Error:", err);

      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the AI server. Please check your backend."
          : err.message || "Unable to get an AI response."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (question) => {
    handleSubmit(null, question);
  };

  // ==========================================
  // WELCOME ANIMATION SCREEN
  // ==========================================

  if (showIntro) {
    return (
      <Box
        sx={{
          height: "100dvh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, #546ce5 0%, #8781ea 50%, #a37fd3 100%)",

          "@keyframes introFade": {
            "0%": {
              opacity: 0,
              transform: "translateY(20px)"
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0)"
            }
          },

          "@keyframes logoFloat": {
            "0%, 100%": {
              transform: "translateY(0px)"
            },
            "50%": {
              transform: "translateY(-10px)"
            }
          },

          "@keyframes glowPulse": {
            "0%, 100%": {
              boxShadow: "0 0 25px rgba(255,255,255,0.12)"
            },
            "50%": {
              boxShadow: "0 0 55px rgba(190,180,255,0.4)"
            }
          },

          "@keyframes loadingProgress": {
            "0%": {
              width: "0%"
            },
            "100%": {
              width: "100%"
            }
          },

          "&::before": {
            content: '""',
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(115,140,255,0.4), transparent 70%)",
            top: "-180px",
            left: "-150px"
          },

          "&::after": {
            content: '""',
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(190,110,255,0.3), transparent 70%)",
            bottom: "-180px",
            right: "-150px"
          }
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "introFade 0.8s ease-out"
          }}
        >
          {/* COMPANY LOGO */}


          <Box
            sx={{
              width: 85,
              height: 85,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
              borderRadius: "28px",
              background: "rgba(255, 255, 255, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "0 12px 35px rgba(90, 80, 160, 0.15)",
              backdropFilter: "blur(12px)",
              animation: "logoFloat 2s ease-in-out infinite"
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Anagha One Logo"
              sx={{
                width: 70,
                height: 70,
                objectFit: "center"
              }}
            />
          </Box>

          {/* BRAND NAME */}

          <Typography
            sx={{
              color: "#ffffff",
              fontSize: { xs: 29, md: 37 },
              fontWeight: 800,
              letterSpacing: 1,
              animation: "introFade 1s ease-out"
            }}
          >
            Anagha One
            <Box
              component="span"
              sx={{
                color: "#a5e4ff",
                ml: 1
              }}
            >
              AI
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "#d2d8ff",
              fontSize: 14,
              mt: 1,
              letterSpacing: 1.2
            }}
          >
            Intelligent HRMS Assistant
          </Typography>

          {/* LOADING INDICATOR */}

          <Box
            sx={{
              width: 160,
              height: 35,
              mt: 4,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 160,
                height: 35,
                "@keyframes snakeMove": {
                  "0%": { transform: "translateX(-100%)" },
                  "100%": { transform: "translateX(160px)" }
                },
                animation: "snakeMove 2.5s linear infinite"
              }}
            >
              <svg width="160" height="35" viewBox="0 0 160 35">
                <path
                  d="M 0 17 Q 10 0 20 17 T 40 17 T 60 17 T 80 17 T 100 17 T 120 17 T 140 17"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 17 Q 10 0 20 17 T 40 17 T 60 17 T 80 17 T 100 17 T 120 17 T 140 17"
                  fill="none"
                  stroke="#a5e4ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="18 10"
                />
                <circle cx="140" cy="17" r="4" fill="#ffffff" />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // ==========================================
  // MAIN CHATBOT PAGE
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100dvh",
        boxSizing: "border-box",
        alignItems: "flex-start",
        pt: { xs: 5, sm: 5, md: 5 },
        display: "flex",
        justifyContent: "center",
        p: 0,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",

        background:
          "linear-gradient(135deg, #b9ccff 0%, #d1baff 45%, #a9d9f3 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          width: { xs: 380, md: 700 },
          height: { xs: 380, md: 700 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45, 91, 255, 0.9) 0%, rgba(91, 119, 255, 0.55) 40%, transparent 75%)",
          filter: "blur(65px)",
          top: "-220px",
          left: "-200px",
          zIndex: -1
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: 400, md: 750 },
          height: { xs: 400, md: 750 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(145, 52, 245, 0.85) 0%, rgba(182, 100, 255, 0.5) 42%, transparent 75%)",
          filter: "blur(75px)",
          bottom: "-260px",
          right: "-200px",
          zIndex: -1
        },

        "@media (prefers-reduced-motion: reduce)": {
          "&::before, &::after": {
            animation: "none"
          }
        }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1050,
          height: {
            xs: "calc(100dvh - 16px)",
            sm: "calc(100dvh - 32px)",
            md: "88dvh"
          },
          minHeight: 0,
          borderRadius: {
            xs: 4,
            sm: 5,
            md: 6
          },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          border: "none",
         boxShadow: "0 20px 60px rgba(39, 35, 105, 0.16)",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            position: "relative",
            background:
              "linear-gradient(110deg, #202f78 0%, #403c9c 48%, #7042ad 100%)",
            px: { xs: 2, md: 3.5 },
            py: 2.2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "white",
            boxShadow: "0 5px 24px rgba(50, 40, 120, 0.2)",

            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
            }
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 2.5,
              bgcolor: "rgba(255,255,255,0.14)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid rgba(255,255,255,0.25)",
              backdropFilter: "blur(10px)"
            }}
          >
            <SmartToyRoundedIcon sx={{ fontSize: 30 }} />
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.3,
                lineHeight: 1.3
              }}
            >
              Anagha One
              <Box
                component="span"
                sx={{
                  color: "#a5e4ff",
                  ml: 1,
                  fontWeight: 500
                }}
              >
                AI
              </Box>
            </Typography>

            <Stack
              direction="row"
              spacing={0.40}
              alignItems="center"
              sx={{ mt: 0.4 }}
            >


              <Typography
                variant="caption"
                sx={{
                  color: "#d2d8ff",
                  letterSpacing: 0.3
                }}
              >
                Intelligent HRMS Assistant
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            icon={
              <AutoAwesomeRoundedIcon
                sx={{ color: "#d8c9ff !important", fontSize: 16 }}
              />
            }
            label="AI Powered"
            size="small"
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontWeight: 600,
              display: { xs: "none", sm: "flex" }
            }}
          />

          <Tooltip title="">
            <span>
              <IconButton
                onClick={handleClearChat}
                disabled={messages.length === 0 || loading}

                sx={{
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 2,
                  ml: 0.5,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.16)"
                  },
                  "&.Mui-disabled": {
                    color: "rgba(255,255,255,0.35)"
                  }
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* CHAT BODY */}

        <Box
          ref={chatBodyRef}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            background:
              "linear-gradient(145deg, #f8f9ff 0%, #f7f5ff 55%, #f1f8ff 100%)",
            px: { xs: 2, md: 4 },
            py: 3,

            "&::-webkit-scrollbar": {
              width: "6px"
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c8c5e8",
              borderRadius: "10px"
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent"
            }
          }}
        >
          {/* EMPTY STATE */}

          {messages.length === 0 && (
            <Box
              sx={{
                maxWidth: 760,
                mx: "auto",
                pt: { xs: 2, md: 5 }
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    width: 78,
                    height: 78,
                    mx: "auto",
                    mb: 2.5,
                    borderRadius: "25px",
                    background:
                      "linear-gradient(135deg, #d6e6ff 0%, #e5d9ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 35px rgba(93, 91, 195, 0.17)"
                  }}
                >
                  <SmartToyRoundedIcon
                    sx={{
                      fontSize: 44,
                      color: "#393b91"
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "#22275d",
                    fontSize: { xs: 25, md: 32 },
                    mb: 1
                  }}
                >
                  Hello! How can I help you?
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#727a98",
                    maxWidth: 520,
                    mx: "auto",
                    lineHeight: 1.8
                  }}
                >
                  Your intelligent HRMS assistant. Ask questions about
                  employees, departments and attendance using simple language.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2
                }}
              >
                <AutoAwesomeRoundedIcon
                  sx={{ color: "#7064c8", fontSize: 19 }}
                />

                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#454477",
                    fontWeight: 800,
                    letterSpacing: 0.7
                  }}
                >
                  TRY ASKING
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                {suggestions.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    onClick={() => handleSuggestion(item.question)}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      border: "1px solid #e4e3f4",
                      borderRadius: 3,
                      cursor: loading ? "default" : "pointer",
                      bgcolor: "rgba(255,255,255,0.85)",
                      transition: "all 0.25s ease",

                      "&:hover": {
                        borderColor: item.color,
                        transform: loading ? "none" : "translateY(-3px)",
                        boxShadow: "0 10px 28px rgba(75, 65, 145, 0.12)",
                        bgcolor: "#ffffff"
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 46,
                        height: 46,
                        bgcolor: `${item.color}16`,
                        color: item.color,
                        borderRadius: 2.5
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 750,
                          color: "#30345f",
                          fontSize: 14.5
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#8990a9",
                          mt: 0.3
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        color: "#8583b5",
                        fontSize: 23,
                        transition: "transform 0.2s ease",
                        ".MuiPaper-root:hover &": {
                          transform: "translateX(4px)"
                        }
                      }}
                    >
                      →
                    </Typography>
                  </Paper>
                ))}
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  flexWrap: "wrap"
                }}
              >
                <Chip
                  icon={<ShieldRoundedIcon />}
                  label="HRMS Data Assistant"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "#777b9b",
                    borderColor: "#dcdcf0",
                    bgcolor: "rgba(255,255,255,0.5)"
                  }}
                />

                <Chip
                  icon={<BusinessRoundedIcon />}
                  label="Anagha One"
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "#777b9b",
                    borderColor: "#dcdcf0",
                    bgcolor: "rgba(255,255,255,0.5)"
                  }}
                />
              </Box>
            </Box>
          )}

          {/* CONVERSATION */}

          <Stack spacing={2.5} sx={{ maxWidth: 800, mx: "auto" }}>
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    gap: 1.2,
                    alignItems: "flex-start"
                  }}
                >
                  {!isUser && (
                    <Avatar
                      sx={{
                        bgcolor: "#e4e4ff",
                        color: "#46449b",
                        width: 36,
                        height: 36
                      }}
                    >
                      <SmartToyRoundedIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Box sx={{ maxWidth: "82%" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#8586a5",
                        fontWeight: 750,
                        display: "block",
                        mb: 0.6,
                        textAlign: isUser ? "right" : "left",
                        letterSpacing: 0.4
                      }}
                    >
                      {isUser ? "YOU" : "ANAGHA ONE AI"}
                    </Typography>

                    <Paper
                      elevation={0}
                      sx={{
                        px: 2.2,
                        py: 1.7,
                        borderRadius: isUser
                          ? "18px 18px 4px 18px"
                          : "4px 18px 18px 18px",
                        bgcolor: isUser ? "#e4eaff" : "#ffffff",
                        border: isUser
                          ? "1px solid #d3ddff"
                          : "1px solid #e9e7f5",
                        boxShadow: "0 4px 15px rgba(55, 48, 120, 0.055)"
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                          color: "#303957",
                          lineHeight: 1.8,
                          fontSize: 14.5
                        }}
                      >
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>

                  {isUser && (
                    <Avatar
                      sx={{
                        bgcolor: "#5145a5",
                        color: "white",
                        width: 36,
                        height: 36,
                        fontSize: 14,
                        fontWeight: 700
                      }}
                    >
                      Y
                    </Avatar>
                  )}
                </Box>
              );
            })}

            {/* LOADING */}

            {loading && (
              <Stack direction="row" spacing={1.3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#e4e4ff",
                    color: "#46449b",
                    width: 36,
                    height: 36
                  }}
                >
                  <SmartToyRoundedIcon fontSize="small" />
                </Avatar>

                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1.4,
                    border: "1px solid #e9e7f5",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2
                  }}
                >
                  <CircularProgress
                    size={17}
                    sx={{ color: "#6655ca" }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    Anagha One AI is thinking...
                  </Typography>
                </Paper>
              </Stack>
            )}

            {/* ERROR */}

            {error && (
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: "#fff1f2",
                  border: "1px solid #fecdd3",
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Paper>
            )}


          </Stack>
        </Box>

        {/* INPUT AREA */}

        <Box
          sx={{
            background: "#ffffff",
            borderTop: "1px solid #eae8f5",
            px: { xs: 2, md: 4 },
            py: 2
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 800,
              mx: "auto",
              display: "flex",
              gap: 1.2,
              alignItems: "center"
            }}
          >
            <TextField
              fullWidth
              placeholder="Ask about employees, departments or attendance..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              size="medium"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "#f8f8ff",
                  "& fieldset": {
                    borderColor: "#e2e0f0"
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaa4df"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6254b8"
                  }
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              sx={{
                minWidth: 54,
                height: 54,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #39449c 0%, #7450bd 100%)",
                boxShadow: "0 6px 18px rgba(76, 65, 165, 0.25)",
                transition: "all 0.2s ease",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2d3688 0%, #603da8 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 22px rgba(76, 65, 165, 0.32)"
                },

                "&.Mui-disabled": {
                  color: "rgba(255,255,255,0.7)",
                  background: "#b9b6d5"
                }
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                <SendRoundedIcon />
              )}
            </Button>
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "#9695b0",
              display: "block",
              textAlign: "center",
              mt: 1.3,
              fontSize: 11
            }}
          >
            Anagha One HRMS Assistant
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;
