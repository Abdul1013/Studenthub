"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { Suspense } from "react";

const ResultPageContent = () => {
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
          `/api/checkout_sessions?session_id=${session_id}`
        );

        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error || "Failed to fetch session data.");
        }
      } catch (err) {
        setError("An error occurred while fetching the session data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }

  const formattedDate = session
    ? format(new Date(session.created * 1000), "PPPpp")
    : "";

  return (
    <Container maxWidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
      {session?.payment_status === "paid" ? (
        <>
          <Typography variant="h6">
            Payment Successful, Thank you for Purchasing.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Subscription ID: {session.id}</Typography>
            <Typography variant="h6">
              Subscription Date: {formattedDate}
            </Typography>
            <Typography variant="h6">
              Subscription Status: {session.status}
            </Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with
              subscription details shortly.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => router.push("/")}
          >
            Go to Homepage
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4">Payment Failed</Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1">
              Your payment wasn&apos;t successful. Please try again later.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => router.push("/")}
          >
            Retry Payment
          </Button>
        </>
      )}
    </Container>
  );
};

const ResultPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResultPageContent />
  </Suspense>
);

export default ResultPage;
