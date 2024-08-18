import React from "react";
import { Subscription } from "../Subscription";
import Navbar from "../Navbar";
import { Box } from "@mui/material";

const SubscriptionPage = () => {
  return (
    <Box style={{ padding: "20px" }} marginTop={10}>
      <Navbar />
      <h1 style={{ textAlign: "center", color: "#222831" }}>
        Choose Your Subscription Plan
      </h1>
      <Subscription />
    </Box>
  );
};

export default SubscriptionPage;
