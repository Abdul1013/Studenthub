"use client";
import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const Professor = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    reader.read().then(function processText({ done, value }) {
      if (done) {
        return result;
      }

      const text = decoder.decode(value || new Uint8Array(), { stream: true });
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
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      // p={4}
    >
      {/* Left side with "Rate My Professor" */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h3" fontWeight="bold" color={"blueviolet"}>
         AI Rate My Professor 👨🏾‍💻📖
        </Typography>
      </Box>

      {/* Right side with the chat interface */}
      <Box
        // flex={2}
        // display="flex"
        // flexDirection="column"
        // justifyContent="center"
        // alignItems="center"
        // boxShadow={3}
        // borderRadius={2}
        // bgcolor="background.paper"
        // p={1}
      >
        <Stack
          direction="column"
          width="500px"
          height="600px"
          p={2}
          spacing={1}
          bgcolor={"grey"}
          borderRadius={"10px"}
        >
          <Stack
            direction={"column"}
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
          <Stack direction={"row"} spacing={2}>
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
    </Box>
  );
};

export default Professor;
