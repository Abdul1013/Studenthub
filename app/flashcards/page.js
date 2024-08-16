"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Container } from "@mui/system";
import { Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import Navbar from "../Navbar";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Handle user authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch flashcards for the authenticated user
  useEffect(() => {
    async function fetchFlashcards() {
      if (!user) return;

      try {
        const flashcardsCollection = collection(db, "flashcards");
        const flashcardsSnapshot = await getDocs(flashcardsCollection);
        const flashcardsList = flashcardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter flashcards to show only the ones created by the current user
        const userFlashcards = flashcardsList.filter(
          (flashcard) => flashcard.userId === user.uid
        );

        setFlashcards(userFlashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }

    fetchFlashcards();
  }, [user]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Navbar />
      <Grid
        container
        spacing={4}
        sx={{
          mt: 10,
        }}
      >
        {flashcards.map((flashcard) => (
          <Grid item key={flashcard.id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Typography variant="h6">{flashcard.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}