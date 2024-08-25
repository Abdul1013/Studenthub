"use client"
import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";

const Professor = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // State to handle error message
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        if (response.status === 429) {
          // Handle rate limit error
          setError(
            "You have exceeded your API usage quota. Please try again later."
          );
          setSnackbarOpen(true);
          return;
        } else {
          setError("An error occurred while processing your request.");
          setSnackbarOpen(true);
          return;
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }

        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      p={4}
    >
      {/* Left side with "Rate My Professor" */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h3" fontWeight="bold" color="blueviolet">
          AI Rate My Professor 👨🏾‍💻📖
        </Typography>
      </Box>

      {/* Right side with the chat interface */}
      <Box flex={2} display="flex" justifyContent="center" alignItems="center">
        <Stack
          direction="column"
          width="500px"
          height="600px"
          p={2}
          spacing={2}
          bgcolor="grey.200"
          borderRadius="10px"
          boxShadow={3}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={
                    message.role === "assistant"
                      ? "primary.main"
                      : "secondary.main"
                  }
                  color="white"
                  borderRadius={15}
                  p={2}
                  maxWidth="70%"
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Type your message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Snackbar for error notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
      />
    </Box>
  );
};

export default Professor;
