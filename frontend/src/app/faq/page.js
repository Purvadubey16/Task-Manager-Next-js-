"use client";

import React from "react";
import Navbar from "../../components/Navbar";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I add a new task?",
      answer:
        "Click on the 'Add Task' button on the top right. Fill in the task details like title, due date, and priority, then click Save.",
    },
    {
      question: "How can I switch between views?",
      answer:
        "Use the toggle buttons in the header to switch between Table view and Card view for your tasks.",
    },
    {
      question: "Can I assign priorities to tasks?",
      answer:
        "Yes, when creating or editing a task, you can set its priority as Low, Medium, or High.",
    },
    {
      question: "Is there a dark mode?",
      answer:
        "Currently, dark mode is not supported but is in our roadmap. Stay tuned!",
    },
    {
      question: "How do I delete a task?",
      answer:
        "Click on the task to open it. Then click the Delete icon and confirm your action.",
    },
    {
      question: "Can I restore deleted tasks?",
      answer:
        "Deleted tasks are permanently removed. We’re planning to add a 'Recycle Bin' in a future update.",
    },
    {
      question: "Is my data synced across devices?",
      answer:
        "Yes, your tasks are stored in the database and synced when you log in from another device.",
    },
    {
      question: "Why am I not seeing my tasks?",
      answer:
        "Make sure you're logged in with the correct account. You can try refreshing the page or clearing your browser cache.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pl-[100px] px-6 text-black m-2">
      <div className="flex items-center gap-4">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          ❓ Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-xl p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
