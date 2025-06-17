"use client";

import * as React from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import HelpIcon from "@mui/icons-material/Help";
import ListIcon from "@mui/icons-material/List";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { text: "Home", path: "/home", icon: <HomeIcon /> },
  { text: "Task Manager", path: "/dashboard", icon: <ListIcon /> },
  { text: "User", path: "#", icon: <PersonIcon /> },
  { text: "Profile", path: "/profileInfo", icon: <PeopleIcon /> },
  { text: "Help & support", path: "/help", icon: <HelpIcon /> },
];

export default function Navbar() {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  return (
    <>
      <Box
        sx={{
          width: 70,
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 1,
        }}
      >
        <Tooltip title="Click to open nabvar">
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
</Tooltip>
        <Divider sx={{ width: "100%", my: 1 }} />

        {navItems.map(({ text, path, icon }) => (
          <Tooltip key={text} title={text} placement="right">
            <Link href={path}>
              <IconButton
                sx={{
                  color: "black",
                  my: 1,
                  "&:hover": {
                    backgroundColor: "#EDC824",
                    color: "white",
                  },
                }}
              >
                {icon}
              </IconButton>
            </Link>
          </Tooltip>
        ))}
      </Box>

      
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            backgroundColor: "#fff",
            color: "black",
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <Box display="flex" alignItems="center" gap={1}>
                <Image src="/alitlogo.png" alt="Logo" width={50} height={50} />
                <span style={{ fontWeight: "bold", color: "#EDC824" }}>
                  Task Manager
                </span>
              </Box>
            </ListItem>
          </List>
          <Divider />

          <List>
            {navItems.map(({ text, path, icon }) => (
              <ListItem key={text} disablePadding>
                <Link
                  href={path}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <ListItemButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "#EDC824",
                        color: "black",
                        "& .MuiListItemIcon-root": {
                          color: "black",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
    </>
  );
}
