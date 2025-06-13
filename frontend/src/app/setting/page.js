"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  return (
    <div className="flex flex-col min-h-screen text-black m-2">
      <div className="flex items-center gap-4">
        <Navbar />
      </div>

      <div className=" mx-auto mt-6">
        <h1 className="text-3xl font-bold text-center mb-8">⚙️ Settings</h1>

        {/* Profile Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">👤 Profile Settings</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700">Enable Email Notifications</span>
          </label>
        </section>

        {/* App Preferences */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🎨 Preferences</h2>
          <label className="block mb-2 text-gray-700">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark (coming soon)</option>
          </select>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">⚠️ Danger Zone</h2>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
