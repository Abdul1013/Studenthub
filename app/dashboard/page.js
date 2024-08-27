"use client";
import React from "react";
import Navbar from "../Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Subscriptions as SubscriptionsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Create as CreateIcon,
  ViewList as ViewListIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const features = [
  {
    id: 1,
    title: "Overview",
    icon: <DashboardIcon />,
    description: "View your overall performance and statistics.",
    path: "/coming-soon",
  },
  {
    id: 2,
    title: "Generate Flashcard",
    icon: <CreateIcon />,
    description: "Create new flashcards for study.",
    path: "./generate",
  },
  {
    id: 3,
    title: "View Flashcards",
    icon: <ViewListIcon />,
    description: "Browse and review your existing flashcards.",
    path: "./flashcards",
  },
  {
    id: 4,
    title: "Payments",
    icon: <PaymentIcon />,
    description: "Manage Subscription.",
    path: "./subscription",
  },
  {
    id: 5,
    title: "Profile",
    icon: <AccountCircleIcon />,
    description: "Update your profile information.",
    path: "/coming-soon",
  },
  {
    id: 6,
    title: "Settings",
    icon: <SettingsIcon />,
    description: "Configure application settings.",
    path: "/coming-soon",
  },
  {
    id: 8,
    title: "Quiz",
    icon: <QuizIcon />,
    description: "Take quizzes to test your knowledge.",
    path: "/coming-soon",
  },
  // {
  //   id: 9,
  //   title: "Rate Professor",
  //   icon: <StarIcon />,
  //   description: "Rate your professors and provide feedback.",
  //   path: "/RateProffesor",
  // },
  // { id: 5, title: 'Subscriptions', icon: <SubscriptionsIcon />, description: 'Manage your subscriptions and billing.' },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(currentUser.displayName || currentUser.email);
      } else {
        router.push("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFeatureClick = (path, e) => {
    e.preventDefault();
    router.push(path);
  };
  return (
    <Container>
      <Navbar />
      <Box sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Dashboard
        </Typography>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ marginTop: "20px" }}
        >
          Welcome, {username}
        </Typography>

        <Grid container spacing={2}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.id}>
              <Paper
                elevation={2}
                style={{
                  padding: "20px",
                  textAlign: "center",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: "#30475E",
                }}
                onClick={(e) => handleFeatureClick(feature.path, e)}
              >
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {feature.icon}
                </div>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
