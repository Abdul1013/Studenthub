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
      setUser(currentUser);
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

  const renderMenuItems = () => (
    <>
      <ListItem>
        <Button onClick={() => router.push("/dashboard")}> Home </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => router.push("/flashcards")}> Flashcards </Button>
      </ListItem>
      {!user ? (
        <>
          <ListItem>
            <Button onClick={() => router.push("/sign-in")}> SignIn </Button>
          </ListItem>
          <ListItem>
            <Button onClick={() => router.push("/sign-up")}> SignUp</Button>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem>
            <Typography
              variant="body1"
              sx={{ marginRight: 2, color: "#FFFFFF" }}
            >
              {user.displayName || "User"}
            </Typography>
          </ListItem>
          <ListItem onClick={handleSignOut}>
            <ListItemText primary="Sign Out" sx={{ color: "#FFFFFF" }} />
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
