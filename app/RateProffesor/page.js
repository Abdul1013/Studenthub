"use-client";
import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { Content } from "next/font/google";

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

  return <div>Professor</div>;
};

export default Professor;
