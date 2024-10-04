"use client";
import { useEffect, useState, Suspense } from "react";
import {  doc, getDoc } from "firebase/firestore";
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

const FlashcardContent = () => {
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
        const docRef = doc(db, "flashcards", search);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const flashcardsArray = data.flashcards || [];
          setFlashcards(flashcardsArray);
        } else {
          setError("Studycards not found.");
        }
      } catch (error) {
        setError("Error fetching Studycards.");
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
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <Grid container spacing={4} sx={{ mt: 10 }}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
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
  );
};

const Flashcard = () => (
  <Suspense fallback={<CircularProgress />}>
    <Container maxWidth="100vw">
      <Navbar />
      
      <FlashcardContent />
    </Container>
  </Suspense>
);

export default Flashcard;
