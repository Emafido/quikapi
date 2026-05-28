"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Field = { name: string; type: string; required: boolean };
type Resource = { name: string; fields: Field[] };
type Schema = { name: string; description: string; resources: Resource[] };

interface BuilderProps {
  onDeploy: (apiId: string, schema: Schema) => void;
}

const EXAMPLES = [
  "A school management system with students, courses, and enrollments",
  "A food delivery app with restaurants, menus, and orders",
  "A hospital system with patients, doctors, and appointments",
  "An e-commerce store with products, categories, and reviews",
];

export default function Builder({ onDeploy }: BuilderProps) {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState<Schema | null>(null);
  const [generating, setGenerating] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState("");

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
        body: JSON.stringify({ name: schema.name, description: schema.description, schema }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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
      <div style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
          placeholder="Describe the API you need..."
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

      {/* Example Prompts */}
      <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setPrompt(ex)}
            style={{
              fontSize: "0.75rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              background: "var(--card)",
              cursor: "pointer",
            }}
          >
            {ex.length > 42 ? ex.slice(0, 42) + "..." : ex}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "0.5rem", background: "#FEF2F2", color: "#DC2626", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      {/* Schema Preview */}
      <AnimatePresence>
        {schema && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: "1.5rem", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}
          >
            {/* Schema Header */}
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--fg)" }}>{schema.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem" }}>{schema.description}</p>
              </div>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", background: "var(--accent-light)", color: "var(--accent)", whiteSpace: "nowrap" }}>
                {schema.resources.length} resources
              </span>
            </div>

            {/* Resources */}
            {schema.resources.map((resource, i) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.875rem", fontWeight: 500, color: "var(--accent)" }}>
                    /{resource.name}
                  </span>
                  <span style={{ fontSize: "0.7rem", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", background: "#F3F4F6", color: "var(--muted)", fontFamily: "var(--mono)" }}>
                    GET · POST · PUT · DELETE
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", background: "#F3F4F6", color: "var(--muted)" }}>
                    id: string
                  </span>
                  {resource.fields.map((field) => (
                    <span
                      key={field.name}
                      style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", background: "#F3F4F6", color: "var(--muted)" }}
                    >
                      {field.name}: {field.type}{field.required && <span style={{ color: "var(--accent)" }}> *</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Deploy */}
            <div style={{ padding: "1rem 1.25rem" }}>
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