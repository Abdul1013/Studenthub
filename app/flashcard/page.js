"use client";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  Typography,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import Navbar from "../Navbar";

export default function Flashcard() {
  const [user, setUser] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState({});
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("id");
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
    async function getFlashcard() {
      if (!search || !user) return;

      try {
        // Reference to the specific document using its ID
        const docRef = doc(db, "flashcards", search);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const flashcardsArray = data.flashcards || []; // Access the flashcards array
          setFlashcards(flashcardsArray);
        } else {
          console.error("No such document!");
          setError("Flashcards not found.");
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setError("Error fetching flashcards.");
      } finally {
        setLoading(false);
      }
    }

    getFlashcard();
  }, [user, search]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="100vw">
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw">
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="100vw">
      <Navbar />
      <Grid container spacing={4} sx={{ mt: 10 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} >
            <Card sx={{ width: "100%" }}>
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.5s",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* : (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Typography variant="h6">No flashcards available</Typography>
      </Box>
      ) */}
    </Container>
  );
}
