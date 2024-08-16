"use client"
import React from "react";
import { Grid, Typography, Button, Paper } from "@mui/material";
import getStripe from "@/utils/get-stripe";

export const Subscription = () => {
  const items = [
    {
      id: 1,
      title: "Basic Plan",
      price: "0 NGN",
      feature1: "Access to basic features",
      feature2: "Limited flashcard creation",
      feature3: "Community support",
    },
    {
      id: 2,
      title: "Pro Plan",
      price: "500 NGN",
      feature1: "Unlimited flashcard creation",
      feature2: "AI-generated flashcards",
      feature3: "Priority support",
    },
    {
      id: 3,
      title: "Enterprise Plan",
      price: "1500 NGN",
      feature1: "Custom solutions",
      feature2: "Access to Student-Planner App",
      feature3: "Advanced analytics",
    },
  ];
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.status === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const error = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn(error.message);
    }
  };
  return (
    <Grid container spacing={2}>
      {items.map((item, id) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Paper
            elevation={3}
            style={{
              padding: 16,
              borderRadius: 10,
              textAlign: "center",
              backgroundColor: "#222831",
              color: "#ECECEC",
            }}
          >
            <Typography variant="h6" component="h6" gutterBottom>
              {item.title}
            </Typography>

            <Typography variant="h6" component="h6" gutterBottom>
              {item.price}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
              {item.feature1}
            </Typography>

            <Typography variant="body1" component="p" gutterBottom>
              {item.feature2}
            </Typography>

            <Typography variant="body1" component="p">
              {item.feature3}
            </Typography>

            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ marginTop: 16, backgroundColor: "#30475E" }}
            >
              Subscribe
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
