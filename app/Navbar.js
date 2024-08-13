import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { SignIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <AppBar  position="fixed" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Studenthub
        </Typography>

        <Button color="inherit"> Flashcard </Button>
        <Button color="inherit"> Rate Proffesor </Button>
        <SignedOut>
          <Button color="inherit"> Login </Button>
          <Button color="inherit">Sign Up</Button>
        </SignedOut>
        <SignIn>
          <UserButton />
        </SignIn>
      </Toolbar>
    </AppBar>
  );
}
