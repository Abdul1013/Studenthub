import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { SignIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="fixed"  sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Studenthub
        </Typography>

        <Button color="inherit">Flashcard</Button>
        <Button color="inherit">Rate Professor</Button>
        <SignedOut>
          <Button color="inherit">
            <a href="/sign-in">Login</a>
          </Button>
          <Button color="inherit">
            <a href="/sign-up">Sign Up</a>
          </Button>
        </SignedOut>
        <SignIn>
          <UserButton />
        </SignIn>
      </Toolbar>
    </AppBar>
  );
}
