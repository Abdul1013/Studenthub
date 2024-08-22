"use client";
import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";


const Professor = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      Content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
        ...messages,
        {role:'user', Content: message},
        {role: 'assistant', content: ''},
    ])

    const response = fetch('/api/chat', {
        method: 'POST',
        headers: {
            'content-Type' : 'application/json',
        },
        body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let result = ''

        return reader.read().then(function processText({done, value}){
            if (done) {
                return result
            }

            const text =decoder.decode(value || new Uint8Array(), {stream: true})
            setMessages((messages) => {
                let lastMessage = messages[messages.length -1]
                let otherMessages = messages.slice(0, messages.length -1)
                return [...otherMessages,
                    {...lastMessage, content: lastMessage.Content + text},
                ]
            })
            return reader.read().then(processText)
        })
    })
  }

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction="column" width="500px" height="700px" p={2} spacing={4}>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
              <Box
                bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={15}
                p={2}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Type In your Prompt"
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
  );
}  

export default Professor;
