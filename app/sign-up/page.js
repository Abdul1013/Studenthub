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
        minHeight: "100vh",
        marginTop: "20px",
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
          x={{
            width: "90%",
            textAlign: "center",
            // padding: "2rem",
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" gutterBottom >
            Sign Up
          </Typography>
          {error && (
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body1" color="success.main" gutterBottom>
              {successMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSignUp}>
            <TextField
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                backgroundColor: "#30475E",
                color: "#FFF",
                mb: 2,
                "&:hover": {
                  backgroundColor: "#2c3e50",
                  cursor: "pointer",
                },
              }}
              fullWidth
            >
              Sign Up with Email
            </Button>
          </Box>

          <Typography variant="h6" >
            Or sign up with
          </Typography>

          <Button
            variant="outlined"
            sx={{
              mt: 2,
              width: "100%",
              backgroundColor: "#4285F4",
              color: "#fff",
              "&:hover": { backgroundColor: "#357ae8" },
              cursor: "pointer",
            }}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>

          <Button
            variant="outlined"
            sx={{
              mt: 2,
              width: "100%",
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": { backgroundColor: "#333" },
              cursor: "pointer",
            }}
            onClick={handleAppleSignIn}
          >
            Continue with Apple
          </Button>

          <Typography variant="body2" sx={{ mt: 4 }}>
              Don&apos;t have an account?{" "}
              <Link href="/sign-in" passHref>
                <Typography
                  component="a"
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Login
                </Typography>
              </Link>
            </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
