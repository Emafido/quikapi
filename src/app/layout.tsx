import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuikAPI — Describe an API. Get a live one.",
  description: "Turn a plain English description into a fully working REST API in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}