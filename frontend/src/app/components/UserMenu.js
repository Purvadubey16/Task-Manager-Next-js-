"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";


import LiveHelpIcon from '@mui/icons-material/LiveHelp';

const UserMenu = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const router = useRouter();

useEffect(() => {
  const fetchDetails = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
      if (!token) return;

      const res = await fetch("http://localhost:3000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  fetchDetails();
}, []);


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
      }}
    >
      <Avatar
        src={userDetails?.profileImageUrl || ""}
        sx={{ width: 40, height: 40, bgcolor: "#059669", cursor: "pointer" }}
      >
        {!userDetails?.profileImageUrl && <PersonIcon />}
      </Avatar>

      <IconButton
        onClick={handleMenuOpen}
        aria-controls="user-menu"
        aria-haspopup="true"
        sx={{ padding: 0 }}
      >
        <ExpandMoreIcon />
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            bgcolor: "white",
            color: "black",
          },
          onMouseLeave: handleMenuClose,
        }}
        MenuListProps={{
          onMouseEnter: () => setAnchorEl(anchorEl), // Keeps open while hovering
        }}
      >
        <MenuItem >
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    {/* Profile Picture */}
    <Avatar
      src={userDetails?.profileImageUrl || ""}
      sx={{ width: 50, height: 50, bgcolor: "#059669" }}
    >
      {!userDetails?.profileImageUrl && <PersonIcon />}
    </Avatar>

    {/* User Name & Email */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: "bold" }}>{userDetails?.name || "User Name"}</span>
      <span style={{ color: "gray", fontSize: "0.9rem" }}>{userDetails?.email}</span>
    </div>
  </div>
</MenuItem>

        <Divider />
        <MenuItem onClick={() => router.push("/profileInfo")}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <PersonIcon />
    <span>My Profile</span>
  </Box>
</MenuItem>
       <MenuItem onClick={() => router.push("/setting")}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <SettingsIcon />
    <span>Settings</span>
  </Box>
</MenuItem>

<MenuItem onClick={() => router.push("/faq")}>
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <LiveHelpIcon />
    <span>FAQ</span>
  </Box>
</MenuItem>
        
  <MenuItem
  onClick={() => setLogoutDialogOpen(true)}
  sx={{
    backgroundColor: "#facc15",
    borderRadius: "12px",
    px: 2,
    py: 1,
    my: 2,
    mx: 2,
    fontWeight: "bold",
    color: "white",
    gap: 1,
    "&:hover": {
      backgroundColor: "#fbbf24",
    },
  }}
>
  <LogoutIcon fontSize="small" />
  Logout
</MenuItem>



      </Menu>
<Dialog
  open={logoutDialogOpen}
  onClose={() => setLogoutDialogOpen(false)}
>
  <DialogTitle>Confirm Logout</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to logout?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setLogoutDialogOpen(false)} color="inherit">
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleLogout();
        setLogoutDialogOpen(false);
      }}
     color="inherit"
    >
      Logout
    </Button>
  </DialogActions>
</Dialog>

      
    </div>
  );
};

export default UserMenu;
