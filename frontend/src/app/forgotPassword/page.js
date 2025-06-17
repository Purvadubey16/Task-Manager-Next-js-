"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TextField, InputAdornment, Divider } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Image from "next/image";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        "http://localhost:3000/user/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
      setOpenDialog(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side Image */}

      {/* Form Section */}
      <div className="w-1/2 flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg border-2 border-gray-300/50 rounded-xl shadow-2xl px-5 py-7"
        >
          <div className="pl-44 pb-3">
            <Image src="/lock.png" alt="Logo" width={70} height={70} />
          </div>

          <h2 className="text-3xl font-bold text-black text-center  pb-5">
            Forgot Password?
          </h2>
          <p className="text-center text-gray-500 text-sm mb-3 px-4">
            Enter your email address and we will send you a link to reset your
            password
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <TextField
              id="email"
              name="email"
              type="email"
              margin="dense"
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <EmailIcon fontSize="small" />
                  Email
                </span>
              }
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                sx: { color: "black" },
              }}
              InputLabelProps={{
                required: false,
                sx: {
                  fontSize: "13px",
                  color: "rgba(107, 114, 128, 1)",
                  "&.Mui-focused": { color: "rgba(107, 114, 128, 1)" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  fontSize: "14px",
                  "& input": { padding: "10px 14px" },
                  "& fieldset": {
                    borderColor: "#A3A3A3",
                    borderRadius: "10px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(107, 114, 128, 1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(107, 114, 128, 1)",
                  },
                },
              }}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm">
                Reset link sent successfully! Check your inbox.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold pt-4 mt-4 pb-4 rounded-xl shadow-md transition ${
                loading
                  ? "bg-[#EDC824] cursor-not-allowed text-gray-700"
                  : "bg-[#EDC824] text-white hover:bg-yellow-400"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Back to?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-[#1E88E5] font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </motion.div>
      </div>

      <div className="w-1/2 flex justify-center items-center h-[400px] pt-60 ">
        <Image
          src="/Forgotpassword.png"
          alt="Forgot Illustration"
          width={500}
          height={300}
          className="object-contain"
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            padding: "20px",
            borderRadius: "20px",
            textAlign: "center",
          },
        }}
      >
        {/* Top Image */}
        <div className="flex justify-center pt-4">
          <Image src="/arrow.png" alt="Mail Sent" width={400} height={100} />
        </div>

        <DialogTitle className="font-bold text-lg pt-2">
          Password Reset Link Sent
        </DialogTitle>

        <DialogContent>
          <DialogContentText className="text-sm text-gray-600">
            Please check your email inbox for the password reset link.
          </DialogContentText>
        </DialogContent>

        {/* Divider */}
        <Divider className="mt-4" />

        {/* Centered OK Button */}
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            autoFocus
            variant="text"
            sx={{ borderRadius: "8px", paddingX: 4, color: "black" }}
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
