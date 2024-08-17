"use client";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  // const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        router.push("./sign-in");
      })
      .catch((error) => {
        console.error("sign-out error:", error);
      });
  };
  return (
    <AppBar position="fixed" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Studenthub
        </Typography>
        <Button color="inherit" component={Link} href="/dashboard">
          Home
        </Button>

        <Button color="inherit" component={Link} href="/flashcards">
          Flashcards
        </Button>

        {!user ? (
          <>
            <Button color="inherit" component={Link} href="/sign-in">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/sign-up">
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.displayName || "User"}
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
