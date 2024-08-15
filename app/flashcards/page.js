"use client";

// import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {db} from "@/firebase";
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
  const [user, setUser] = useState(null)
  const router = useRouter();

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


  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const userId = user.uid;
      const docRef = doc(collection(db, "users"), userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const flashcards = docSnap.data().flashcards || [];
        setFlashcards(flashcards);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);
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
