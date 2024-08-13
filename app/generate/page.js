"use client";

import db from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { collection, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Generate() {
  const [isLoaded, isSignedIn, user] = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false); // for modals
  const router = useRouter();

  const handleSubmit = async () => {
    fetch("api/generate", {
      method: "POST",
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your deck");
      return;
    }
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collection = docSnap.data().flashcards || [];
      if (collection.find((f) => f.name === name)) {
        alert("A deck with this name already exists");
        return;
      } else {
        collection.push({ name });
        batch.set(userDocRef, { flashcards: collection }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }
    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcards) => {
      const cardDocref = doc(colRef);
      batch.set(cardDocref, flashcards);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
    // const response = await fetch('/api/save', {
  };

  return (
    <Container>
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4"> Generate Flashcard </Typography>
        <Paper sx={{p:4, width:"100%"}}>
            <TextField value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb:2, }}/>
            <Button variant="contained" color="#30475E" onClick={handleSubmit} fullWidth></Button>
        </Paper>
      </Box>
    </Container>
  );
}
