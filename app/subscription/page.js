import React from "react";
import { Subscription } from "../Subscription";
import Navbar from "../Navbar";

const SubscriptionPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h1 style={{ textAlign: "center", color: "#222831" }}>
        Choose Your Subscription Plan
      </h1>
      <Subscription />
    </div>
  );
};

export default SubscriptionPage;
