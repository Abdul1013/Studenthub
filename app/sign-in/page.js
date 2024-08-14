"use client";
import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { app } from "@/firebase";
import Navbar from "@/app/Navbar";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
// import App from "next/app";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  // const [passwordless, setPasswordless] = useState(false);

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleSignInWithPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/generate")
    } catch (error) {
      setError(error.message);
    }
  };

  // const handlePasswordlessSignIn = async () => {
  //   const actionCodeSettings = {
  //     url: window.location.href, // The URL the user will be redirected to after sign-in.
  //     handleCodeInApp: true,
  //   };

  //   try {
  //     await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  //     window.localStorage.setItem("emailForSignIn", email);
  //     alert("An email has been sent to you. Please check your inbox.");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        marginTop: "10px",
      }}
    >
      <Navbar />
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          padding: "2rem",
          border: "2px solid #30475E",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            width: "90%",
            textAlign: "center",
            padding: "2rem",
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
            Sign In
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleSignInWithPassword}
            sx={{
              backgroundColor: "#30475E",
              color: "#FFF",
              mb: 2,
              "&:hover": {
                backgroundColor: "#2c3e50",
              },
            }}
            fullWidth
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={handleGoogleSignIn}
            sx={{
              backgroundColor: "#DB4437",
              color: "#FFF",
              "&:hover": {
                backgroundColor: "#c1351d",
              },
            }}
            fullWidth
          >
            Sign In with Google
          </Button>

          {/* <Button
          variant="text"
          onClick={() => setPasswordless(!passwordless)}
          fullWidth
          sx={{ mt: 2, color: "#30475E" }}
        >
          {passwordless
            ? "Sign In with Password Instead"
            : "Sign In with Email Link Instead"}
        </Button> */}
        </Box>
      </Paper>
    </Container>
  );
}
