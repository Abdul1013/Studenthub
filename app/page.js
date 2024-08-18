"use client";
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import Head from "next/head";
import Navbar from "./Navbar";
import { FeatureSection } from "./FeatureSection";
import { Subscription } from "./Subscription";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { analytics } from "@/firebase"; // Import analytics
import { logEvent } from "firebase/analytics"; // Import logEvent
import Footer from "./Footer";

export default function Home() {
  const router = useRouter();
  // const analytics = getAnalytics(); // Ensure analytics is initialized
  useEffect(() => {
    // Log an initial page view
    const logPageView = (url) => {
      if (analytics) {
        logEvent(analytics, "page_view", {
          page_path: url,
        });
      } else {
        console.warn("Analytics not initialized.");
      }
    };

    logPageView(window.location.pathname);

    const handleRouteChange = (url) => {
      logPageView(url);
    };

    const originalPush = router.push;
    router.push = (url) => {
      handleRouteChange(url);
      return originalPush.call(router, url);
    };

    return () => {
    };
  }, [ router]);

  return (
    <Container>
      <Head>
        <title>StudentHub</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>
      <Navbar />
      <Box
        marginTop={10}
        padding={2}
        borderRadius={2}
        textAlign="center"
        bgcolor={"#ECECEC"}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Welcome To StudentHub
        </Typography>

        <Typography
          variant="h6"
          component="h6"
          sx={{
            mb: 4,
            fontSize: { xs: "1rem", sm: "1.25rem" },
            px: { xs: 2, sm: 0 },
          }}
        >
          Combine intelligent flashcard creation with smart study features.
          Enhance your knowledge retention and optimize your study habits with
          AI-driven insights, enabling you to achieve your learning goals with
          ease.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#30475E",
            "&:hover": { backgroundColor: "#2C3E50" },
            mt: 4,
            px: { xs: 2, sm: 4 },
            py: { xs: 1, sm: 2 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
          onClick={() => router.push("./dashboard")}
        >
          Get Started
        </Button>
      </Box>

      <Box marginTop={6}>
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: "center",
          }}
        >
          Features
        </Typography>
        <FeatureSection type="features" />
      </Box>

      <Box marginTop={6}>
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: "center",
          }}
        >
          Pricing
        </Typography>
        <Subscription />
      </Box>

      <Footer />
    </Container>
  );
}
