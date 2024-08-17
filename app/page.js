"use client";
import { Container, Box, Typography, Button, Grid, Paper, TextField } from "@mui/material";
import Head from "next/head";
import Navbar from "./Navbar";
import { FeatureSection } from "./FeatureSection";
import { Subscription } from "./Subscription";
import { useRouter } from "next/navigation";
import { analytics } from "@/firebase";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const logEvent = (url) => {
      analytics.logEvent("page_view", {
        page_path: url,
      });
    };

    logEvent(window.location.pathname);

    // Log page view on route change
    router.events.on("routeChangeComplete", logEvent);

    // Cleanup event listener on unmount
    return () => {
      router.events.off("routeChangeComplete", logEvent);
    };
  }, [router.events]);

  return (
    <Container maxWidth="lg">
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


      {/* <Box marginTop={6}> faq section
        <Typography
          variant="h3"
          sx={{
            mt: 4,
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            textAlign: "center",
          }}
        >
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          FAQ Items...
        </Grid>
      </Box> */}

      {/* Newsletter Signup Section */}
      <Box
        marginTop={6}
        textAlign="center"
        bgcolor="#ECECEC"
        padding={4}
        borderRadius={2}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Subscribe to Our Newsletter
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Stay updated with the latest features and tips to enhance your study
          experience.
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle the newsletter signup logic here
          }}
        >
          <TextField
            required
            label="Email Address"
            variant="outlined"
            type="email"
            sx={{ mr: 2, width: { xs: "100%", sm: "300px" } }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#30475E",
              "&:hover": { backgroundColor: "#2C3E50" },
            }}
          >
            Subscribe
          </Button>
        </form>
      </Box>
    </Container>
  );
}
