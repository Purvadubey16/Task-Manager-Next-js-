"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { motion } from "framer-motion";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Image from "next/image";
import { Eye, EyeOff, LockIcon } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
const params = useParams();
  const token = params.token;  // Extract token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/user/reset-password/${token}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/"); // Redirect to login
        }, 2000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: Form */}
      <div className="w-1/2 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl p-4"
        >
          <div className="pl-40 pb-3 pt-3">
            <Image src="/resetlock.png" alt="Lock Icon" width={100} height={100} />
          </div>

          <h2 className="text-3xl font-bold text-black text-center  pb-1">
            Reset Password
          </h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Please choose a new password
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* New Password */}
            <TextField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label={
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <LockIcon size={16} />
                  New Password
                </span>
              }
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                sx: { color: "black" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                required:false,
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
                  "& fieldset": { borderRadius: "10px" },
                },
              }}
            />

            {/* Confirm Password */}
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              label={
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <LockIcon size={16} />
                  Confirm Password
                </span>
              }
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputProps={{
                sx: { color: "black" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                required:false,
                sx: {
                  fontSize: "13px",
                  color: "rgba(107, 114, 128, 1)",
                  "&.Mui-focused": { color: "rgba(107, 114, 128, 1)" },
                },
              }}
              sx={{
                 mt: 2, // margin top (e.g., 3 * 8px = 24px)
                "& .MuiOutlinedInput-root": {
                  height: "50px",
                  fontSize: "14px",
                  "& fieldset": { borderRadius: "10px" },
                },
              }}
             
            />

            {/* Error/Success Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Password updated successfully.</p>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold pt-4 mt-4 pb-4 rounded-xl shadow-md transition ${
                loading
                  ? "bg-[#EDC824] cursor-not-allowed text-gray-700"
                  : "bg-[#EDC824] text-white hover:bg-yellow-400"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
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

      {/* Right: Image */}
      <div className="w-1/2 flex justify-center items-center h-[400px] pt-60">
        <Image
          src="/Resetpassword.png"
          alt="Reset Illustration"
          width={500}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  );
}



