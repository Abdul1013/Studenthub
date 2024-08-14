"use client";

// import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import db from "@/firebase";
import { useRouter } from "next/navigation";
import { Container } from "@mui/system";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Navbar from "../Navbar";

export default function Flashcards() {
  // const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collection = docSnap.data().flashcards || [];
        setFlashcards(collection);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, []);
  // if (isLoaded || isSignedIn) {
  //   return <></>;
  // }

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
