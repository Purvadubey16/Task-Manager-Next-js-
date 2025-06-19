"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { InputAdornment, IconButton } from "@mui/material";
import Image from "next/image";
import { login, register } from "../services/UserService";


export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
    const [formErrors, setFormErrors] = useState({
    terms: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const router = useRouter();

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    setFormErrors({
      terms: "",
      password: "",
      confirmPassword: "",
      general: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRememberMe(false);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedPassword = localStorage.getItem("rememberedPassword");

    if (storedEmail !== null) {
      setEmail(storedEmail);
    }

    if (storedPassword !== null) {
      setPassword(storedPassword);
    }
    setIsMounted(true);

    // if (storedEmail || storedPassword) {
    //   setRememberMe(true);
    // }
  }, []);
  if (!isMounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //setError(""); // Clear previous errors
    setFormErrors({
      terms: "",
      password: "",
      confirmPassword: "",
      general: "",
    });

    if (isSignup) {
      if (!termsAccepted) {
        console.log("Terms not accepted");
        setFormErrors((prev) => ({
          ...prev,
          terms: "Please accept the terms and conditions to proceed.",
        }));
        setLoading(false);
        return;
      }
      const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!regex.test(password)) {
        setFormErrors((prev) => ({
          ...prev,
          password:
            "Password must be at least 8 characters long, contain an uppercase letter, and a special character.",
        }));
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        console.log("password do not match");
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match.",
        }));
        setLoading(false);
        return;
      }
    }


    try {
    let response;
    if (isSignup) {
      response = await register({ name, email, password });
      // Signup success
      setIsSignup(false);
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    } else {
      response = await login({ email, password });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }
        router.push("/dashboard");
      
      }
    } catch (error) {
      const status = error?.response?.status;
  const message = error?.response?.data?.message || "Network error, please try again later.";

  console.error("Error Status:", status);
  alert(message);
  setLoading(false);
    }
  };

  const validatePassword = (value) => {
    setPassword(value);
    if (isSignup) {
      const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!regex.test(value)) {
        setError(
          "Password must be at least 8 characters long, contain an uppercase letter, and a special character."
        );
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:w-1/2 md:flex justify-center items-center h-[400px] pt-60 pl-15 ">
        <Image
          src={isSignup ? "/signup.png" : "/login.png"}
          alt="Illustration"
          width={800} 
          height={600}
          className="object-contain"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center  ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl  p-4"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="flex items-center justify-center ">
            <Image
              src={"/alitlogo.png"}
              alt="Logo"
              width={100}
              height={100}
            ></Image>
          </div>

          <h4 className="text-center text-xl pb-1">Alit Technology</h4>

          <h2 className="text-3xl font-bold text-black text-center  drop-shadow">
            {isSignup ? "Sign Up" : "Log In"}
          </h2>

          {!isSignup && (
            <p className="text-center text-gray-500 text-sm mb-2">
              please login to continue
            </p>
          )}

          {isSignup && (
            <p className="text-center text-gray-500 text-sm mb-2">
              Create new account
            </p>
          )}
          <form
            className="space-y-6"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {isSignup && (
              <TextField
                id="name"
                name="name"
                margin="dense"
                label={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <PersonIcon style={{ marginTop: "-5px", fontSize: 18 }} />
                    Name
                  </span>
                }
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  sx: {
                    color: "black", // text color
                  },
                }}
                InputLabelProps={{
                  required: false,
                  sx: {
                    fontSize: "13px",
                    color: "rgba(107, 114, 128, 1)",
                    "&.Mui-focused": {
                      color: "rgba(107, 114, 128, 1)",
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: "14px",
                    "& input": {
                      padding: "10px 14px",
                    },
                    "& fieldset": {
                      borderColor: "rgba(107, 114, 128, 1)",
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
              ></TextField>
            )}

            <TextField
              id="email"
              name="email"
              type="email"
              margin="dense"
              label={
                <span
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <EmailIcon style={{ marginTop: "-5px", fontSize: 18 }} />
                  Email
                </span>
              }
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                sx: {
                  color: "black",
                },
              }}
              InputLabelProps={{
                required: false,
                sx: {
                  fontSize: "13px",
                  color: "rgba(107, 114, 128, 1)",
                  "&.Mui-focused": {
                    color: "rgba(107, 114, 128, 1)",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "45px",
                  fontSize: "14px",
                  "& input": {
                    padding: "10px 14px",
                  },
                  "& fieldset": {
                    borderColor: "rgba(107, 114, 128, 1)",
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

            <TextField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="dense"
              label={
                <span
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "4px",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <LockIcon style={{ fontSize: 18 }} />
                  </span>
                  <span style={{ lineHeight: 1 }}>Password</span>
                </span>
              }
              fullWidth
              variant="outlined"
              value={password}
               onChange={(e) => {
    const value = e.target.value;
    setPassword(value);

    // Clear error if password becomes valid while typing
    if (isSignup) {
      const regex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (regex.test(value)) {
        setFormErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  }}

              
              required
               error={isSignup && !!formErrors.password}
               helperText={isSignup && formErrors.password}
              InputProps={{
                sx: {
                  color: "black",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                required: false,
                sx: {
                  fontSize: "13px",
                  color: "rgba(107, 114, 128, 1)",
                  "&.Mui-focused": {
                    color: "rgba(107, 114, 128, 1)",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "45px",
                  fontSize: "14px",
                  "& input": {
                    padding: "10px 14px",
                  },
                  "& fieldset": {
                    borderColor: "rgba(107, 114, 128, 1)",
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

            {isSignup && (
              <TextField
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                margin="dense"
                label={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "4px",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <LockIcon style={{ fontSize: 18 }} />
                    </span>
                    <span style={{ lineHeight: 1 }}>Confirm Password</span>
                  </span>
                }
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={isSignup && password !== confirmPassword}
                helperText={
                  isSignup && password !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  sx: { color: "black" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  required: false,
                  sx: {
                    fontSize: "13px",
                    color: "rgba(107, 114, 128, 1)",
                    "&.Mui-focused": {
                      color: "rgba(107, 114, 128, 1)",
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "45px",
                    fontSize: "14px",
                    "& input": {
                      padding: "10px 14px",
                    },
                    "& fieldset": {
                      borderColor: "rgba(107, 114, 128, 1)",
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
            )}

            {!isSignup && (
              <div className="flex justify-between ">
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="rememberMe" className="text-black text-sm">
                    Remember Me
                  </label>
                </div>

                <div>
                  <button
                    className="mt-2 text-[#1E88E5] text-sm"
                    onClick={() => router.push("/forgotPassword")}
                    type="button"
                  >
                    Frogot password?
                  </button>
                </div>
              </div>
            )}

            {isSignup && (
              <div className="flex flex-col mb-1">
                <div className="flex items-start space-x-2 mt-2">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (formErrors.terms) {
                          setFormErrors((prev) => ({ ...prev, terms: "" }));
                        }
                      }}
                      className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="terms" className="text-black text-sm">
                      I agree to the{" "}
                      <span className="text-[#1E88E5] cursor-pointer hover:underline">
                        Terms and Conditions
                      </span>
                    </label>
                    {formErrors.terms && (
                      <p className="text-xs text-red-600 mt-1">
                        {formErrors.terms}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              //  disabled={loading || (isSignup && (!termsAccepted || !!error))}

              className={`w-full font-semibold py-2 rounded-xl shadow-md transition   ${
                loading
                  ? "bg-yellow-300 cursor-not-allowed text-gray-700"
                  : "bg-yellow-500 text-white hover:bg-yellow-400"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Loading...</span>
                </span>
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </button>
          </form>

          {!isSignup && (
            <div className="text-center mt-4 mb-5">
              <h6>{isSignup ? "or sign up via" : "Or Log in via"}</h6>
            </div>
          )}

          {isSignup && (
            <p className="mt-4 text-sm text-center text-gray-600">
              {isSignup ? "Already Register?" : "Don't have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="text-[#1E88E5] font-semibold hover:underline "
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          )}

          <div className="flex justify-center gap-4 ">
            <button className="p-2 rounded-full border hover:bg-gray-100">
              <Image src="/google.jpg" alt="Google" width={24} height={24} />
            </button>

            <button className="p-2 rounded-full border hover:bg-gray-100">
              <Image
                src="/facebook.png"
                alt="Facebook"
                width={24}
                height={24}
              />
            </button>

            <button className="p-2 rounded-full border hover:bg-gray-100">
              <Image
                src="/linkedin.png"
                alt="LinkedIn"
                width={24}
                height={20}
              />
            </button>
          </div>

          {!isSignup && (
            <p className="mt-6 text-sm text-center text-gray-600">
              {isSignup ? "Already Register?" : "Don't have an account?"}{" "}
              <button
                onClick={toggleForm}
                className="text-[#1E88E5] font-semibold hover:underline "
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          )}
          {isSignup && (
            <div className="text-center ">
              <h6 className="text-gray-500 text-sm">
                {isSignup ? "or use your email for signup" : "or log in via"}
              </h6>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}



