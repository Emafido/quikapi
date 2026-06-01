"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatDate, getBaseUrl } from "@/lib/utils";

type Api = {
  id: string;
  name: string;
  description: string;
  schema: string;
  createdAt: string;
};

export default function Dashboard() {
  const [apis, setApis] = useState<Api[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/apis")
      .then((r) => r.json())
      .then((d) => setApis(d.apis ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function deleteApi(id: string) {
    await fetch(`/api/apis/${id}`, { method: "DELETE" });
    setApis((prev) => prev.filter((a) => a.id !== id));
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "7rem 1.5rem 4rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              className="font-serif"
              style={{ fontSize: "2.5rem", color: "var(--fg)", lineHeight: 1.1 }}
            >
              My APIs
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.4rem" }}>
              {loading
                ? "Loading..."
                : `${apis.length} deployed ${apis.length === 1 ? "API" : "APIs"}`}
            </p>
          </div>
          <Link
            href="/"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "0.5rem 1.25rem",
              borderRadius: "0.75rem",
              background: "var(--accent)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            + New API
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
            Loading your APIs...
          </div>
        )}

        {/* Empty state */}
        {!loading && apis.length === 0 && (
          <div
            style={{
              borderRadius: "1.25rem",
              border: "1px dashed var(--border)",
              padding: "5rem 2rem",
              textAlign: "center",
            }}
          >
            <p
              className="font-serif"
              style={{ fontSize: "1.75rem", color: "var(--fg)", marginBottom: "0.75rem" }}
            >
              Nothing here yet
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                marginBottom: "1.5rem",
                maxWidth: "20rem",
                margin: "0 auto 1.5rem",
              }}
            >
              Generate and deploy your first API from the builder. It takes under 60 seconds.
            </p>
            <Link
              href="/"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                padding: "0.5rem 1.25rem",
                borderRadius: "0.75rem",
                background: "var(--accent)",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Open Builder
            </Link>
          </div>
        )}

        {/* API Grid */}
        {!loading && apis.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {apis.map((api, i) => {
              const schema = JSON.parse(api.schema);
              const base = `${getBaseUrl()}/api/live/${api.id}`;
              const key = `url-${api.id}`;

              return (
                <motion.div
                  key={api.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    borderRadius: "1rem",
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      padding: "1.1rem 1.25rem",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--fg)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {api.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--muted)",
                          marginTop: "0.2rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {api.description}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteApi(api.id)}
                      style={{
                        flexShrink: 0,
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.1rem 0.3rem",
                        lineHeight: 1,
                        opacity: 0.5,
                      }}
                      title="Delete API"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Resources */}
                  <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Resources
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                      {schema.resources.map((r: { name: string }) => (
                        <span
                          key={r.name}
                          style={{
                            fontSize: "0.75rem",
                            fontFamily: "var(--mono)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "0.25rem",
                            background: "var(--accent-light)",
                            color: "var(--accent)",
                          }}
                        >
                          /{r.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Base URL */}
                  <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Base URL
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontFamily: "var(--mono)",
                          color: "var(--muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {base}
                      </span>
                      <button
                        onClick={() => copy(base, key)}
                        style={{
                          fontSize: "0.7rem",
                          fontFamily: "var(--mono)",
                          color: copied === key ? "#10B981" : "var(--accent)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        {copied === key ? "✓" : "copy"}
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "0.75rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--muted)",
                        fontFamily: "var(--mono)",
                      }}
                    >
                      Created {formatDate(api.createdAt ?? "")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <span
                        style={{
                          width: "0.375rem",
                          height: "0.375rem",
                          borderRadius: "9999px",
                          background: "#10B981",
                          display: "inline-block",
                        }}
                      />
                      <span style={{ fontSize: "0.72rem", color: "#10B981", fontFamily: "var(--mono)" }}>
                        live
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}