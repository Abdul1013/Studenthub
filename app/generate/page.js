"use client";

import { db, auth } from "@/firebase";
import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  Paper,
  TextField,
  Typography,
  Card,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { collection, getDoc, writeBatch, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Generate() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false); // for modals
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/generate", {
        method: "POST",
        body: text,
      });
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards", error);
    } finally {
      setLoading(false);
    }
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

  // // const saveFlashcards = async () => {
  //   if (!name) {
  //     alert("Please enter a name for your deck");
  //     return;
  //   }

  //   if (!user || !user.uid) {
  //     alert("User is not authenticated. Please sign in.");
  //     return;
  //   }

  //   setSaving(true);
  //   const batch = writeBatch(db);
  //   const userDocRef = doc(db, "users", user.uid);
  //   const docSnap = await getDoc(userDocRef);

  //   let existingDecks = [];

  //   if (docSnap.exists()) {
  //     existingDecks = docSnap.data().flashcards || [];
  //     if (existingDecks.find((deck) => deck.name === name)) {
  //       alert("A deck with this name already exists");
  //       setSaving(false);
  //       return;
  //     }
  //   }

  //   // Add the new deck to the user's collection
  //   existingDecks.push({ name });
  //   batch.set(userDocRef, { flashcards: existingDecks }, { merge: true });

  //   // Set flashcards in a subcollection for the deck
  //   const colRef = collection(
  //     db,
  //     "users",
  //     user.uid,
  //     "flashcards",
  //     name,
  //     "cards"
  //   );

  //   flashcards.forEach((flashcard) => {
  //     const cardDocRef = doc(colRef, flashcard.id);
  //     batch.set(cardDocRef, flashcard);
  //   });

  //   try {
  //     await batch.commit();
  //     handleClose();
  //     router.push("/flashcards");
  //   } catch (error) {
  //     console.error("Error saving flashcards", error);
  //   } finally {
  //     setSaving(false);
  //   }

  //   // const response = await fetch('/api/save', {
  // };

  // const saveFlashcards = async () => {
  //   if (!name) {
  //     alert("Please enter a name for your flashcard set.");
  //     return;
  //   }

  //   try {
  //     const userDocRef = doc(db, "users", user.uid);
  //     const userDocSnap = await getDoc(userDocRef);

  //     const batch = writeBatch(db);

  //     if (userDocSnap.exists()) {
  //       const userData = userDocSnap.data();
  //       const updatedSets = [...(userData.flashcardSets || []), { name }];
  //       batch.update(userDocRef, { flashcardSets: updatedSets });
  //     } else {
  //       batch.set(userDocRef, { flashcardSets: [{ name }] });
  //     }

  //     // The key part is ensuring the path to the document isn't empty
  //     const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
  //     flashcards.forEach((flashcard) => {
  //       const cardDocRef = doc(collection(setDocRef, "cards"), flashcard.id);
  //       batch.set(cardDocRef, flashcard);
  //     });

  //     await batch.commit();

  //     alert("Flashcards saved successfully!");
  //     handleCloseDialog();
  //     setName("");
  //     router.push("/flashcards");
  //   } catch (error) {
  //     console.error("Error saving flashcards:", error);
  //     alert("An error occurred while saving flashcards. Please try again.");
  //   }
  // };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Container>
      <Navbar />
      <Box
        sx={{
          mt: 10,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4"> Generate Flashcard </Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: "#30475E" }}
            onClick={handleSubmit}
            fullWidth
          >
            {" "}
            Submit{" "}
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4"> Flashcard Preview </Typography>
          <Grid container spacing={4}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card sx={{ width: "100%" }}>
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(flashcard.id);
                    }}
                  >
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
                            transform: flipped[flashcard.id]
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
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#30475E" }}
              onClick={handleOpen}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the deck you want to save the flashcards
            to.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ backgroundColor: "#30475E" }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#30475E" }}
            onClick={saveFlashcards}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
