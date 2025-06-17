"use client";

import React from "react";
import UserMenu from "../components/UserMenu";
import Navbar from "../components/Navbar";
import { Typography, Button } from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const start = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col h-screen pl-[70px] text-black">
      {/* Top Right User Menu */}
      <div className="pt-2 pb-2.5 flex justify-between  pl-2 pr-6 shadow-sm bg-gray-100">
         <div className="flex  items-center gap-4 ">
          <Navbar />
          <Typography variant="h5" className="font-bold">
            Home
          </Typography>
        </div>
        <UserMenu />
      </div>

      {/* Top Navbar */}
      <div className="sticky top-0 z-30 pt-2 bg-gray-50/100  px-6 ">
       
      </div>

      {/* Welcome Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-50/100">
        <div className="text-center max-w-xl px-6 py-10 bg-white/80 rounded-2xl shadow-xl backdrop-blur-lg">
          <div className="flex justify-center mb-4">
            <EmojiObjectsIcon style={{ fontSize: 48, color: "#EDC824" }} />
          </div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-3">
            Welcome to Your Task Manager!
          </Typography>
          <p className="text-gray-600 text-md mb-6">
            Organize, prioritize, and stay productive. Let’s help you get things
            done effortlessly.
          </p>
          <Button
            variant="contained"
            style={{ backgroundColor: "#EDC824" }}
            size="large"
            className="rounded-full px-6"
            onClick={start}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
