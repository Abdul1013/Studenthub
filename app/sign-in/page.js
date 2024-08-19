"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAuth,
  getRedirectResult,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import app from "@/firebase";
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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Google Sign-In successful: ", result.user);
          setSuccessMessage("Sign-in successful! Redirecting to Dashboard...");
          router.push("/dashboard");
        } else {
          console.log("No redirect result. Staying on the sign-in page.");
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        setError(getErrorMessage(error.code));
      }
    };
  
    handleRedirectResult();
  }, [auth, router]);
  
  useEffect(() => {
    const checkAuthState = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in:", user);
        router.push("/dashboard");
      } else {
        console.log("No user logged in. Staying on sign-in page.");
      }
    });
  
    return () => checkAuthState(); // Cleanup subscription on unmount.
  }, [auth, router]);
  

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
  };

  const handleSignInWithPassword = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Sign-in successful! Redirecting to Dashboard...");
      router.push("/dashboard");
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(getErrorMessage(error.code));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case "auth/invalid-email":
        return "Invalid email address. Please check your email and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/user-not-found":
        return "No account found with this email. Please sign up.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was canceled. Please try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
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
            Sign In
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography variant="body1" color="success.main" gutterBottom sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSignIn}>
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
              required
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
                cursor: "pointer",
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
                cursor: "pointer",
              }}
              fullWidth
            >
              Sign In with Google
            </Button>
            <Typography variant="body2" sx={{ mt: 4 }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                passHref
                style={{
                  color: "primary.main",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
