import React from "react";
import { Grid, Button, Typography, Paper } from "@mui/material";

export const FeatureSection = () => {
  const items = [
    {
      id: 1,
      title: "Flashcard Creation",
      feature1:
        " Users can create flashcards by typing in questions and answers.",
      feature2:
        "Import Content: Ability to import content from text files, PDFs, or other formats.",
      feature3:
        "AI-Generated Flashcards: Automatically generate flashcards from input text or documents using AI.",
    },
    {
      id: 2,
      title: "Advanced Features",
      feature1:
        "Contextual Learning: Use AI to provide explanations or additional context based on user questions.",
      feature2:
        "Adaptive Learning: Adjust study recommendations and difficulty based on user progress and performance.",
    },

    {
      id: 3,
      title: "Progress Tracking",
      feature1:
        "Statistics: Track study progress with metrics like the number of flashcards reviewed, accuracy, and time spent.",
      feature2:
        "Performance Insights: Provide feedback and suggestions based on user performance and study habits.",
    },
    {
      id: 4,
      title: "Customization",
      feature1:
        "Customizable Flashcards: Add images, audio, or links to flashcards.",
      feature2:
        "Multiple-Choice and Fill-in-the-Blank: Support different types of flashcards, including multiple-choice and fill-in-the-blank.",
      feature3:
        "Theming: Allow users to customize the app’s appearance with different themes or color schemes.",
    },
    {
      id: 5,
      title: "Study Modes",
      feature1:
        "Review Mode: Go through flashcards one by one with the option to reveal the answer.",
      feature2:
        "Quiz Mode: Test users with multiple-choice questions or fill-in-the-blank questions based on flashcard content.",
      feature3:
        "Spaced Repetition: Use algorithms to schedule flashcard reviews based on user performance and retention needs.",
    },

    {
      id: 6,
      title: "Gamification",
      feature1:
        "Achievements and Badges: Reward users with achievements and badges for reaching milestones or completing challenges.",
      feature2:
        "Leaderboards: Include leaderboards for competitive study sessions or challenges.",
      feature3:
        "Collaborative Features: Share flashcard decks with others and collaborate on study materials.",
    },
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item, id) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Paper
            elevation={3}
            style={{
              padding: 16,
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: "#C1A57B",
            }}
          >
            <Typography variant="h5" component="h6">
              {item.title}
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              {item.feature1}
            </Typography>
            {item.feature2 && (
              <Typography variant="body1" component="p" gutterBottom>
                {item.feature2}
              </Typography>
            )}
            {item.feature3 && (
              <Typography variant="body1" component="p">
                {item.feature3}
              </Typography>
            )}
            <Button
              variant="contained"
              style={{ marginTop: 16, backgroundColor: "#30475E" }}
            >
              Learn More
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
