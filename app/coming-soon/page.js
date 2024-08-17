"use client"
import { Container, Box, Typography } from "@mui/material";
import React from "react";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ComingSoon = () => {

  const [user, setUser] = useState(null);
//   const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // setUsername(currentUser.displayName || currentUser.email);
      } else {
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <Container
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
      <Box
        sx={{
          width: "100%",
          maxHeight: "100vh",
        }}
      >
        <Typography variant="h2" component="h2" sx={{ mt: 5 }}>
          Coming Soon
        </Typography>
      </Box>
    </Container>
  );
};

export default ComingSoon;
