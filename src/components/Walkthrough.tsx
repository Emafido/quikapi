"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function Walkthrough() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("quikapi-tour-seen");
    if (!seen) {
      setTimeout(() => setShown(true), 1200);
    }
  }, []);

  useEffect(() => {
    if (!shown) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "#0D0D0D",
      overlayOpacity: 0.7,
      smoothScroll: true,
      allowClose: true,
      progressText: "{{current}} of {{total}}",
      nextBtnText: "Got it →",
      prevBtnText: "← Back",
      doneBtnText: "Start building",
      popoverClass: "quikapi-tour",
      steps: [
        {
          element: "#tour-builder",
          popover: {
            title: "Describe your API",
            description:
              "Start here. Type what kind of API you need in plain English — like 'a food delivery app with restaurants and orders'. No technical knowledge needed.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-generate",
          popover: {
            title: "Generate your schema",
            description:
              "A schema is a blueprint. It defines what data your API will store — like a table in a spreadsheet, but for your backend. The AI creates this from your description instantly.",
            side: "bottom",
            align: "end",
          },
        },
        {
          popover: {
            title: "Review & edit before deploying",
            description:
              "After generating, you'll see a schema editor. Add, remove, or rename fields before deploying. Think of fields like columns in a spreadsheet — they define what data each record holds.",
          },
        },
        {
          popover: {
            title: "Deploy = go live",
            description:
              "When you hit Deploy, QuikAPI creates real API endpoints — URLs that any app or device can send data to and receive data from. Your API is instantly usable by anyone.",
          },
        },
        {
          popover: {
            title: "Test it right here",
            description:
              "No need to open Postman or write any code. Use the built-in API Tester to send real requests and see real responses — GET, POST, PUT, DELETE all work out of the box.",
          },
        },
        {
          popover: {
            title: "Copy code snippets",
            description:
              "Every endpoint comes with ready-to-use code in fetch, axios, and curl — with comments explaining every line. Copy and paste directly into your project.",
          },
        },
        {
          popover: {
            title: "Ready to build 🚀",
            description:
              "That's everything. Your API will be live in under 60 seconds. Click 'Start building' and let's go.",
          },
        },
      ],
      onDestroyStarted: () => {
        localStorage.setItem("quikapi-tour-seen", "true");
        setShown(false);
        driverObj.destroy();
      },
    });

    driverObj.drive();
  }, [shown]);

  return (
    <button
      onClick={() => {
        localStorage.removeItem("quikapi-tour-seen");
        setShown(true);
      }}
      style={{
        fontSize: "0.75rem",
        fontFamily: "var(--mono)",
        padding: "0.3rem 0.75rem",
        borderRadius: "9999px",
        border: "1px solid var(--border)",
        background: "var(--card)",
        color: "var(--muted)",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      ? take a tour
    </button>
  );
}