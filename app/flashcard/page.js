"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import db from "@/firebase";
import { useSearchParams } from "next/navigation";
import { Container, Grid } from "@mui/material";
import Navbar from "../Navbar";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
        ...prev,
        [id] : !prev[id],
    }))
  }
  if (isLoaded || isSignedIn) {
    return <></>;
  }
  return <Container maxWidth="100vw">
    <Navbar/>
    <Grid container spacing={4} sx={{ mt: 10}}>
        
    </Grid>
  </Container>
}
