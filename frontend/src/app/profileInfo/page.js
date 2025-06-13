"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Divider,
  Avatar,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "../components/Navbar";
import UserMenu from "../components/UserMenu";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Page = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [lastname,setLastname] = useState("");

  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      const res = await fetch("http://localhost:3000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      setUserDetails(data);
      setEditedName(data.name);
      setEditedEmail(data.email);
      setLastname(data.lastname ||"" );
      setPhone(data.phone || "");
      setDob(data.dob || "");
      setGender(data.gender || "");
      setCountry(data.country || "");
      setState(data.state || "");
      setCity(data.city || "");
      setPostalCode(data.address?.postalCode || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile)); // Optional preview

    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    setUploading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:3000/user/upload-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Image upload failed");
      }

      setSnackbarMessage("Profile image uploaded successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDetails(); // Refresh profile image from server
    } catch (err) {
      console.error("Upload error:", err);
      setSnackbarMessage("Error uploading image");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setUploading(false);
  };

  const handleChangePassowrd = (e) => {
    setChangePassword(e.target.checked);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:3000/user/upload-profile", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await res.json();
        setSnackbarMessage("Profile picture updated!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setFile(null);
        setPreviewUrl(null);
        fetchDetails();
      } else {
        const text = await res.text();
        throw new Error(text || "Image upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setSnackbarMessage("Error uploading image");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateNameEmail = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      setSnackbarMessage("Name and Email cannot be empty");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (changePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setSnackbarMessage("All password fields are required");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      if (newPassword !== confirmPassword) {
        setSnackbarMessage("New password and confirmation do not match");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      if (!isPasswordStrong(newPassword)) {
        setSnackbarMessage(
          "Password must be at least 8 characters, contain 1 uppercase letter and 1 special character"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    }
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3000/user/${userDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          lastname: lastname || null,
          phone: phone || null,
          dob: dob || null,
          gender: gender || null,
          country: country || null,
          state: state || null,
          city: city || null,
          postalCode: postalCode || null,

          ...(changePassword && {
            oldPassword: currentPassword,
            password: newPassword,
          }),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDetails();
      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteProfileImage = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `http://localhost:3000/user/${userDetails.id}/profile-image`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      setPreviewUrl(null);
      setSnackbarMessage("Profile image deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDetails();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Error deleting image");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (!userDetails) return <p className="pl-[250px] p-10">Loading...</p>;
  const isPasswordStrong = (password) => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pl-[250px] text-black ">
        <div className=" pt-4 flex justify-end bg-gray-100 pb-3 pr-6">
          <UserMenu />
        </div>

        <div className="p-4">
          <div className="flex justify-between mb-4  pt-2">
            <p className="bg-[#EDC824] px-3 py-2 mb-4 rounded-2xl text-white">
              Profile Information
            </p>
          </div>

          <Divider></Divider>
          {/* Profile Header */}
          <div className="flex items-center mb-4 gap-4 mt-3 ">
            <div
              className="relative group cursor-pointer "
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar
                src={previewUrl || userDetails?.profileImageUrl || ""}
                sx={{ width: 100, height: 100 }}
              >
                {!userDetails?.profileImageUrl && !previewUrl && (
                  <PersonIcon fontSize="large" />
                )}
              </Avatar>
              {/* Spinner centered on top of Avatar */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                  <CircularProgress size={32} />
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-[#EDC824] text-black rounded-full w-7 h-7 flex items-center justify-center text-xl border-2 border-white">
                ✎
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div>
              <p className="font-bold text-xl">{userDetails.name}</p>
              <p>{userDetails.email}</p>
            </div>
          </div>

          {/* Upload Profile Image Button
      {file && (
        <Button
          onClick={handleUpload}
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
        >
          Upload Profile Image
        </Button>
      )} */}

          {/* Delete Button */}
          {userDetails?.profileImageUrl && (
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setConfirmOpen(true)}
              color="inherit"
              sx={{
                borderColor: "#A3A3A3",
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#ffe6e6",
                  borderColor: "#b71c1c",
                },
                mb: 2,
                pl: 2,
              }}
            >
              Delete Profile Image
            </Button>
          )}

          <Divider />

          {/* Personal Information */}
          <h1 className="bg-[#EDC824] text-white rounded-xl p-2 mt-4 mb-4 ">
            Personal Information
          </h1>
          <div className="flex flex-wrap gap-4 ">
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Enter your name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            />
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Enter your Last name"
              value={lastname}
              onChange={(e)=>setLastname(e.target.value)}
            />
          
          </div>

          <div className="flex flex-wrap gap-4 mt-2 ">
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Phone number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />
              <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Enter your email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
           
          </div>

          <div className="flex flex-wrap gap-4 mt-2 ">
           <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e)=>setDob(e.target.value)}
            />
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Gender"
              value={gender}
              onChange={(e)=>setGender(e.target.value)}
            />
          </div>

          {/* Address Section */}
          <h1 className="bg-[#EDC824] text-white rounded-xl p-2 mt-6 mb-4">
            Address Information
          </h1>
          <div className="flex flex-wrap gap-4">
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Country"
              value={country}
              onChange={(e)=>setCountry(e.target.value)}
            />
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="State"
                value={state}
              onChange={(e)=>setState(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="City"
                value={city}
              onChange={(e)=>setCity(e.target.value)}
            />
            <input
              className="border flex-1 p-2 rounded border-gray-400"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e)=>setPostalCode(e.target.value)}
            />
          </div>

          <div>
            <div className="py-3">
              <input
                type="checkbox"
                id="changePassword"
                checked={changePassword}
                onChange={handleChangePassowrd}
              />

              <label htmlFor="changePassword">Change your password</label>
            </div>
            {changePassword && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 border-gray-400 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 border-gray-400 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 border-gray-400 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateNameEmail}
              sx={{
                borderRadius: "50px",
                textTransform: "none",
                paddingX: 4,
                paddingY: 1,
              }}
            >
              Save Changes
            </Button>
          </div>

          {/* Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Confirm Dialog */}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Delete Profile Image?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your profile image? This action
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setConfirmOpen(false);
                  handleDeleteProfileImage();
                }}
                color="error"
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Page;
