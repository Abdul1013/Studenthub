"use client";
import React, { useState } from "react";
import Navbar from "@/app/Navbar";
import Link from "next/link";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setSuccessMessage("Sign-up successful! Redirecting to sign-in page...");
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage(
        "Sign-up with Google successful! Redirecting to sign-in page..."
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAppleSignIn = async () => {
    e.preventDefault();
    const provider = new OAuthProvider("apple.com");
    try {
      await signInWithPopup(auth, provider);
      setSuccessMessage(
        "Sign-up with Apple successful! Redirecting to sign-in page..."
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
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
        maxHeight: "100vh",
        marginTop: "100px",
      }}
    >
      <Navbar />
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          padding: "2rem",
          border: "2px solid #30475E",
          borderRadius: "8px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            textAlign: "center",
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 5 }}>
            Sign Up
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body1" color="success.main" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required/>

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#30475E",
                color: "#FFF",
                mb: 2,
                "&:hover": {
                  backgroundColor: "#2c3e50",
                },
                cursor: "pointer",
              }}
              fullWidth
            >
              Sign Up with Email
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Or sign up with
          </Typography>

          <Button
            variant="contained"
            onClick={handleGoogleSignIn}
            sx={{
              backgroundColor: "#4285F4",
              color: "#FFF",
              mb: 2,
              "&:hover": {
                backgroundColor: "#357ae8",
              },
              cursor: "pointer",
            }}
            fullWidth
          >
            Continue with Google
          </Button>

          <Button
            variant="contained"
            onClick={handleAppleSignIn}
            sx={{
              backgroundColor: "#000",
              color: "#FFF",
              mb: 2,
              "&:hover": {
                backgroundColor: "#333",
              },
              cursor: "pointer",
            }}
            fullWidth
          >
            Continue with Apple
          </Button>

          <Typography variant="body2" sx={{ mt: 4 }}>
            Already have an account?{" "}
            <Link href="/sign-in" passHref>
              <Typography
                component="a"
                sx={{
                  color: "primary.main",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Sign In
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
