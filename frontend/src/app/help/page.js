"use client";

import React from "react";
import Navbar from "../components/Navbar";

const HelpSupport = () => {
  return (
    <div className="flex flex-col min-h-screen pl-[260px] pr-6 pt-4 text-black bg-gray-50">
      <Navbar />

      <div className="max-w-5xl w-full mx-auto mt-4  p-4 rounded-xl ">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#5045E5]">Help & Support</h1>

        {/* Getting Started */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 bg-[#EDC824] p-1 rounded-2xl">🔍 Getting Started</h2>
          <p className="text-gray-700">
            To start using the Task Manager App:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Create an account or log in.</li>
            <li>Add tasks using the <strong>Add Task</strong> button.</li>
            <li>Set due dates, priorities, and track statuses.</li>
            <li>Switch between card and table views for convenience.</li>
          </ul>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 bg-[#EDC824] p-1 rounded-2xl">🛠 Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Search, sort, and filter tasks based on name, status, or due date.</li>
            <li>Click on any task to edit or delete it.</li>
            <li>Tasks are saved automatically using local storage/database.</li>
          </ul>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 bg-[#EDC824] p-1 rounded-2xl">❓ Frequently Asked Questions</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <strong>Q: Can I recover deleted tasks?</strong>
              <p>A: Currently, deleted tasks are permanently removed. A recycle bin feature is planned.</p>
            </div>
            <div>
              <strong>Q: Is my data safe?</strong>
              <p>A: Yes. All data is securely stored and accessible only to you.</p>
            </div>
            <div>
              <strong>Q: Why can’t I see my tasks after logging in?</strong>
              <p>A: Ensure you’re logged in with the correct account. Try refreshing the page or clearing your browser cache.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 bg-[#EDC824] p-1 rounded-2xl">📨 Contact Support</h2>
          <p className="text-gray-700 mb-2">Still need help? Reach out to us:</p>
          <ul className="text-gray-700 list-inside list-disc">
            <li>Email: <a href="mailto:support@taskmanagerapp.com" className="text-blue-600 underline">support@taskmanagerapp.com</a></li>
            <li>Phone: +91-98765-43210 (Mon–Fri, 10AM–6PM)</li>
          </ul>
        </section>

        {/* Feedback Form */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 bg-[#EDC824] p-1 rounded-2xl">📝 Submit Feedback</h2>
          <p className="text-gray-700 mb-4">
            We’re always looking to improve. Let us know your suggestions!
          </p>
          <form className="space-y-4">
            <textarea
              placeholder="Your feedback..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              rows={4}
            />
            <button
              type="submit"
              className="bg-[#5045E5] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default HelpSupport;
