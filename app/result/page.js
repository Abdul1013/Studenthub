"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(
          `/api/checkout_session?session_id=${session_id}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An Error Occured");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          textAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }
  return (
    <Container
      maxWidth="100vw"
      sx={{
        textAlign: "center",
        mt: 4,
      }}
    >
      {session.payment_status === "paid" ? (
        <>
          <Typography variant="h6">
            Payment Successful, Thank you for Purchasing.
          </Typography>
          <Box>
            <Typography variant="h6">Subscription ID: {session.id}</Typography>
            <Typography variant="h6">
              Subscription Date: {session.created}
            </Typography>
            <Typography variant="h6">
              Subscription Status: {session.status}
            </Typography>
            <Typography variant="body1">
              We have recieved your Payment. you will recieve an email with
              Subscription details shortly
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment Failed </Typography>
          <Box sx={{mt:4}}>
            <Typography variant="body1">
                Your Payment wasn't Successful. Please try again later
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
