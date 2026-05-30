"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { getBaseUrl } from "@/lib/utils";
import CodeSnippet from "./CodeSnippet";
import ApiTester from "./ApiTester";

type Field = { name: string; type: string; required: boolean };
type Resource = { name: string; fields: Field[] };
type Schema = { name: string; description: string; resources: Resource[] };

interface EndpointListProps {
  apiId: string;
  schema: Schema;
}

const METHOD_COLORS: Record<string, { bg: string; text: string }> = {
  GET:    { bg: "#ECFDF5", text: "#059669" },
  POST:   { bg: "#EFF6FF", text: "#2563EB" },
  PUT:    { bg: "#FFFBEB", text: "#D97706" },
  DELETE: { bg: "#FEF2F2", text: "#DC2626" },
};

const METHODS = ["GET", "POST", "PUT", "DELETE"];

export default function EndpointList({ apiId, schema }: EndpointListProps) {
  const [copied, setCopied] = useState("");
  const [openSnippet, setOpenSnippet] = useState<string | null>(null);
  const [openTester, setOpenTester] = useState<string | null>(null);
  const base = `${getBaseUrl()}/api/live/${apiId}`;

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: "1.5rem" }}
    >
      <div style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}>

        {/* Header */}
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--fg)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", background: "#10B981", display: "inline-block", flexShrink: 0 }} />
              {schema.name} is live
            </h3>
            <p style={{ fontSize: "0.75rem", fontFamily: "var(--mono)", color: "var(--muted)", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {base}
            </p>
          </div>
          <button
            onClick={() => copy(base, "base")}
            style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", color: "var(--muted)", background: "transparent", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {copied === "base" ? "Copied!" : "Copy base URL"}
          </button>
        </div>

        {/* Resources */}
        {schema.resources.map((resource, i) => (
          <motion.div
            key={resource.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)" }}
          >
            {/* Resource header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.8rem", fontFamily: "var(--mono)", fontWeight: 600, color: "var(--muted)" }}>
                /{resource.name}
              </p>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  onClick={() => {
                    setOpenTester(openTester === resource.name ? null : resource.name);
                    setOpenSnippet(null);
                  }}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "0.375rem",
                    border: "1px solid var(--border)",
                    background: openTester === resource.name ? "#059669" : "transparent",
                    color: openTester === resource.name ? "#fff" : "#059669",
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                    transition: "all 0.15s",
                  }}
                >
                  {openTester === resource.name ? "hide tester" : "test it"}
                </button>
                <button
                  onClick={() => {
                    setOpenSnippet(openSnippet === resource.name ? null : resource.name);
                    setOpenTester(null);
                  }}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "0.375rem",
                    border: "1px solid var(--border)",
                    background: openSnippet === resource.name ? "var(--accent)" : "transparent",
                    color: openSnippet === resource.name ? "#fff" : "var(--accent)",
                    cursor: "pointer",
                    fontFamily: "var(--mono)",
                    transition: "all 0.15s",
                  }}
                >
                  {openSnippet === resource.name ? "hide code" : "view code"}
                </button>
              </div>
            </div>

            {/* Endpoint rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {METHODS.map((method) => {
                const url = `${base}/${resource.name}${method === "PUT" || method === "DELETE" ? "?recordId=" : ""}`;
                const key = `${method}-${resource.name}`;
                const colors = METHOD_COLORS[method];
                return (
                  <div key={method} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", fontFamily: "var(--mono)", fontWeight: 600, padding: "0.2rem 0.4rem", borderRadius: "0.25rem", background: colors.bg, color: colors.text, width: "3.5rem", textAlign: "center", flexShrink: 0 }}>
                      {method}
                    </span>
                    <span style={{ fontSize: "0.78rem", fontFamily: "var(--mono)", color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {url}
                    </span>
                    <button
                      onClick={() => copy(url, key)}
                      style={{ fontSize: "0.72rem", color: copied === key ? "#10B981" : "var(--accent)", background: "transparent", border: "none", cursor: "pointer", flexShrink: 0, fontFamily: "var(--mono)" }}
                    >
                      {copied === key ? "✓" : "copy"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* API Tester panel */}
            {openTester === resource.name && (
              <ApiTester
                baseUrl={base}
                resource={resource.name}
                fields={resource.fields}
              />
            )}

            {/* Code Snippet panel */}
            {openSnippet === resource.name && (
              <CodeSnippet
                baseUrl={base}
                resource={resource.name}
                fields={resource.fields}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}