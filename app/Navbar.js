"use client";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        router.push("./sign-in");
      })
      .catch((error) => {
        console.error("sign-out error:", error);
      });
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <List>
      <ListItem button component={Link} href="/dashboard">
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} href="/flashcards">
        <ListItemText primary="Flashcards" />
      </ListItem>
      {!user ? (
        <>
          <ListItem button component={Link} href="/sign-in">
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} href="/sign-up">
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.displayName || "User"}
            </Typography>
          </ListItem>
          <ListItem button onClick={handleSignOut}>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#222831" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Studenthub
        </Typography>

        {isMobile  ? (
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
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/dashboard">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/flashcards">
              Flashcards
            </Button>

            {!user ? (
              <>
                <Button color="inherit" component={Link} href="/sign-in">
                  Login
                </Button>
                <Button color="inherit" component={Link} href="/sign-up">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {user.displayName || "User"}
                </Typography>
                <Button color="inherit" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
