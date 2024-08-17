"use client";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const renderMenuItems = () => (
    <>
      <ListItem>
        <Button onClick={() => router.push("/dashboard")} aria-label="Home">
          Home
        </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => router.push("/flashcards")} aria-label="Flashcards">
          Flashcards
        </Button>
      </ListItem>
      {!user ? (
        <ListItem>
          <Box sx={{ display: "flex", gap: 2}}>
            <Button onClick={() => router.push("/sign-in")} aria-label="Sign-In">
              Login
            </Button>
            <Button onClick={() => router.push("/sign-up")} aria-label="Sign-Up">
              SignUp
            </Button>
          </Box>
        </ListItem>
      ) : (
        <>
          <ListItem>
            <Typography variant="body1" sx={{ marginRight: 2, color: "#FFFFFF" }}>
              {user.displayName || "User"}
            </Typography>
          </ListItem>
          <ListItem button onClick={handleSignOut}>
            <ListItemText primary="SignOut" sx={{ color: "#FFFFFF" }} />
          </ListItem>
        </>
      )}
    </>
  );

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Studenthub
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: { bgcolor: "#222831", color: "#FFFFFF" },
              }}
            >
              <List>{renderMenuItems()}</List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <List sx={{ display: "flex", flexDirection: "row" }}>
              {renderMenuItems()}
            </List>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
