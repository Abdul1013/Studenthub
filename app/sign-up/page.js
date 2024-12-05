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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

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
        minHeight: "100vh",
        px: 2,
        marginTop: "50px",
      }}
    >
      <Navbar />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 2,
          textAlign: "center",
          fontSize: {
            xs: "1.8rem",
            sm: "2rem",
          },
          color: "primary.main",
        }}
      >
        Welcome to StudyHub
      </Typography>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: {
            xs: "1.5rem",
            sm: "2rem",
          },
          border: "2px solid #30475E",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
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
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              mb: 2,
              fontSize: {
                xs: "1.5rem",
                sm: "1.8rem",
              },
            }}
          >
            Sign Up
          </Typography>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{
                mb: 2,
                fontSize: {
                  xs: "0.9rem",
                },
              }}
            >
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography
              variant="body1"
              color="success.main"
              sx={{
                mb: 2,
                fontSize: {
                  xs: "1rem",
                },
              }}
            >
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
              label="Username"
              type="text"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
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
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
              }}
            >
              Sign Up with Email
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 4,
              fontSize: {
                xs: "0.85rem",
              },
            }}
          >
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
