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
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword){
      setError("Passwords do not match. Please try again");
      return;
    }

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
              onChange={(e) => setConfirmPassword(e.target.value)}
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
