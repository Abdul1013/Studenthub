import React from "react";
import Navbar from "@/app/Navbar";
import { SignIn } from "@clerk/nextjs";
import { Container, Box, Typography } from "@mui/material";

export default function SignUpPage() {
  return (
    <Container>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
