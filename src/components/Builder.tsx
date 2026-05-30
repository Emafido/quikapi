"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SchemaEditor from "./SchemaEditor";

type Field = { name: string; type: string; required: boolean };
type Resource = { name: string; fields: Field[] };
type Schema = { name: string; description: string; resources: Resource[] };

interface BuilderProps {
  onDeploy: (apiId: string, schema: Schema) => void;
}

const PLACEHOLDERS = [
  "A school management system with students, courses, and enrollments...",
  "A food delivery app with restaurants, menus, and orders...",
  "A hospital system with patients, doctors, and appointments...",
  "A fintech app with users, wallets, and transactions...",
  "A logistics platform with riders, packages, and deliveries...",
];

export default function Builder({ onDeploy }: BuilderProps) {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<Schema | null>(null);
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

  const placeholderIndex = useRef(0);
  const charIndex = useRef(0);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function type() {
      const current = PLACEHOLDERS[placeholderIndex.current];
      if (charIndex.current < current.length) {
        setPlaceholder(current.slice(0, charIndex.current + 1));
        charIndex.current++;
        typingTimer.current = setTimeout(type, 35);
      } else {
        typingTimer.current = setTimeout(erase, 2500);
      }
    }

    function erase() {
      const current = PLACEHOLDERS[placeholderIndex.current];
      if (charIndex.current > 0) {
        setPlaceholder(current.slice(0, charIndex.current - 1));
        charIndex.current--;
        typingTimer.current = setTimeout(erase, 18);
      } else {
        placeholderIndex.current =
          (placeholderIndex.current + 1) % PLACEHOLDERS.length;
        typingTimer.current = setTimeout(type, 400);
      }
    }

    typingTimer.current = setTimeout(type, 1000);
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    setSchema(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSchema(data.schema);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDeploy() {
    if (!schema) return;
    setDeploying(true);
    setError("");

    try {
      const res = await fetch("/api/apis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: schema.name,
          description: schema.description,
          schema,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#0D0D0D"],
      });

      onDeploy(data.id, schema);
      setSchema(null);
      setPrompt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setDeploying(false);
    }
  }

  return (
    <div style={{ width: "100%" }}>

      {/* Prompt Input */}
      <div
        id="tour-builder"
        style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
          placeholder={prompt ? "" : placeholder}
          rows={4}
          style={{
            width: "100%",
            padding: "1.25rem",
            fontSize: "0.9rem",
            resize: "none",
            outline: "none",
            background: "transparent",
            color: "var(--fg)",
            fontFamily: "inherit",
            border: "none",
          }}
        />
        <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--muted)" }}>
            Ctrl + Enter to generate
          </span>
          <button
            id="tour-generate"
            onClick={handleGenerate}
            disabled={!prompt.trim() || generating}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: generating || !prompt.trim() ? "#A5B4FC" : "var(--accent)",
              color: "#fff",
              border: "none",
              cursor: generating || !prompt.trim() ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {generating ? "Generating..." : "Generate Schema"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.5rem", background: "#FEF2F2", color: "#DC2626", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      {/* Schema Editor */}
      <AnimatePresence>
        {schema && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: "1.5rem",
              borderRadius: "1rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--card)",
            }}
          >
            {/* Editor header */}
            <div
              style={{
                padding: "0.875rem 1.25rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--fg)" }}>
                  Review & Edit Schema
                </span>
                <span style={{ fontSize: "0.7rem", fontStyle: "italic", color: "var(--muted)" }}>
                  — tweak anything before deploying
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "var(--mono)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  background: "var(--accent-light)",
                  color: "var(--accent)",
                }}
              >
                {schema.resources.length} resources
              </span>
            </div>

            {/* Editor body */}
            <div style={{ padding: "1rem 1.25rem" }}>
              <SchemaEditor schema={schema} onChange={setSchema} />
            </div>

            {/* Deploy */}
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)" }}>
              <button
                onClick={handleDeploy}
                disabled={deploying}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  background: deploying ? "#A5B4FC" : "var(--accent)",
                  color: "#fff",
                  border: "none",
                  cursor: deploying ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {deploying ? "Deploying..." : "Deploy API"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}