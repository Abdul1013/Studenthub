"use client";
import { Box, Container, Grid, Typography, Link, TextField, Button } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#222831",
        color: "#FFFFFF",
        py: 3,
        mt: "10px",
        borderRadius: "6px"
      }}
      marginTop={6}

    >
      <Container maxWidth="lg"  >
      <Box
        textAlign="center"
        bgcolor="#C1A57B"
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
              mt:"2px",
            }}
          >
            Subscribe
          </Button>
        </form>
      </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              Studenthub is your go-to platform for managing and learning with flashcards. Keep track of your progress and achieve your goals.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/dashboard" color="inherit" underline="none">
              <Typography variant="body2">Dashboard</Typography>
            </Link>
            <Link href="/flashcards" color="inherit" underline="none">
              <Typography variant="body2">Flashcards</Typography>
            </Link>
            <Link href="/contact" color="inherit" underline="none">
              <Typography variant="body2">Contact Us</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Stay Connected
            </Typography>
            <Typography variant="body2">
              Follow us on social media to stay updated with the latest features.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Link href="#" color="inherit" underline="none" sx={{ pr: 1 }}>
                Facebook
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ pr: 1 }}>
                Twitter
              </Link>
              <Link href="#" color="inherit" underline="none">
                Instagram
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} Studenthub. All rights reserved. @abdulthedev
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
