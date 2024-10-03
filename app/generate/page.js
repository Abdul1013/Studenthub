"use client";

import { db } from "@/firebase";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

export default function Generate() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [deckName, setDeckName] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards", error);
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

  const saveFlashcards = async () => {
    if (!deckName.trim()) {
      setSnackbarMessage("Please enter a name for your flashcard set.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setSaving(true);

    try {
      const user = getAuth().currentUser;

      if (!user) {
        setSnackbarMessage("You need to be signed in to save flashcards.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      const flashcardSet = {
        userId: user.uid,
        name: deckName.trim(),
        flashcards,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "flashcards"), flashcardSet);

      setSnackbarMessage("Flashcards saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleClose();
      setDeckName("");
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      setSnackbarMessage(
        "An error occurred while saving flashcards. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
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
        <Typography variant="h4">Generate Studycards</Typography>
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
            Submit
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4">Flashcard Preview</Typography>
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
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
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
            disabled={saving}
          >
            {saving ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
