"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Field {
  name: string;
  type: string;
  required: boolean;
}

interface ApiTesterProps {
  baseUrl: string;
  resource: string;
  fields: Field[];
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

const METHOD_COLORS: Record<Method, { bg: string; text: string }> = {
  GET:    { bg: "#ECFDF5", text: "#059669" },
  POST:   { bg: "#EFF6FF", text: "#2563EB" },
  PUT:    { bg: "#FFFBEB", text: "#D97706" },
  DELETE: { bg: "#FEF2F2", text: "#DC2626" },
};

const METHOD_EXPLANATIONS: Record<Method, string> = {
  GET:    "Fetching all records from this resource",
  POST:   "Creating a new record with the data below",
  PUT:    "Updating an existing record by its ID",
  DELETE: "Deleting an existing record by its ID",
};

const STATUS_EXPLANATIONS: Record<number, string> = {
  200: "Success — the request worked and data was returned",
  201: "Created — a new record was successfully saved",
  400: "Bad request — something was wrong with the data you sent",
  404: "Not found — that record or resource doesn't exist",
  500: "Server error — something went wrong on the backend",
};

function getDefaultValue(type: string): string | number | boolean {
  if (type === "number") return 0;
  if (type === "boolean") return false;
  return "";
}

export default function ApiTester({ baseUrl, resource, fields }: ApiTesterProps) {
  const [method, setMethod] = useState<Method>("GET");
  const [recordId, setRecordId] = useState("");
  const [bodyFields, setBodyFields] = useState<Record<string, string | number | boolean>>(
    Object.fromEntries(fields.map((f) => [f.name, getDefaultValue(f.type)]))
  );
  const [response, setResponse] = useState<{
    status: number;
    data: unknown;
    time: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const needsBody = method === "POST" || method === "PUT";
  const needsId = method === "PUT" || method === "DELETE";
  const url = `${baseUrl}/${resource}${needsId ? `?recordId=${recordId}` : ""}`;

  async function fire() {
    setLoading(true);
    setError("");
    setResponse(null);

    const start = Date.now();

    try {
      const options: RequestInit = {
        method,
        headers: needsBody ? { "Content-Type": "application/json" } : {},
        body: needsBody ? JSON.stringify(bodyFields) : undefined,
      };

      const res = await fetch(url, options);
      const data = await res.json();
      const time = Date.now() - start;

      setResponse({ status: res.status, data, time });
    } catch {
      setError("Request failed — check your network connection");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: string, type: string) {
    setBodyFields((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : type === "boolean" ? value === "true" : value,
    }));
  }

  const statusColor = response
    ? response.status < 300
      ? "#059669"
      : response.status < 500
      ? "#D97706"
      : "#DC2626"
    : "var(--muted)";

  return (
    <div
      style={{
        marginTop: "0.75rem",
        borderRadius: "0.75rem",
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--border)",
          background: "#FAFAF9",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            width: "0.4rem",
            height: "0.4rem",
            borderRadius: "9999px",
            background: "#10B981",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "0.78rem",
            fontFamily: "var(--mono)",
            color: "var(--fg)",
            fontWeight: 600,
          }}
        >
          API Tester
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          — fire real requests without leaving the page
        </span>
      </div>

      <div style={{ padding: "1rem" }}>

        {/* Method Selector */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.72rem",
              fontFamily: "var(--mono)",
              color: "var(--muted)",
              marginBottom: "0.4rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Method — what do you want to do?
          </label>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {(["GET", "POST", "PUT", "DELETE"] as Method[]).map((m) => {
              const colors = METHOD_COLORS[m];
              const active = method === m;
              return (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setResponse(null); }}
                  style={{
                    fontSize: "0.75rem",
                    fontFamily: "var(--mono)",
                    fontWeight: 600,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: active ? "none" : "1px solid var(--border)",
                    background: active ? colors.bg : "transparent",
                    color: active ? colors.text : "var(--muted)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "0.72rem",
              color: "var(--muted)",
              fontStyle: "italic",
              marginTop: "0.4rem",
            }}
          >
            {METHOD_EXPLANATIONS[method]}
          </p>
        </div>

        {/* Record ID input for PUT/DELETE */}
        {needsId && (
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontFamily: "var(--mono)",
                color: "var(--muted)",
                marginBottom: "0.4rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Record ID — which record should we target?
            </label>
            <input
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              placeholder="Paste the record ID here (e.g. from a GET response)"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                fontSize: "0.78rem",
                fontFamily: "var(--mono)",
                background: "transparent",
                color: "var(--fg)",
                outline: "none",
              }}
            />
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--muted)",
                marginTop: "0.3rem",
                fontStyle: "italic",
              }}
            >
              Tip: run a GET request first to see existing record IDs
            </p>
          </div>
        )}

        {/* Body fields for POST/PUT */}
        {needsBody && fields.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontFamily: "var(--mono)",
                color: "var(--muted)",
                marginBottom: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Request body — the data you want to send
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {fields.map((field) => (
                <div key={field.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      minWidth: "8rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--mono)",
                        color: "var(--fg)",
                        fontWeight: 500,
                      }}
                    >
                      {field.name}
                    </span>
                    {field.required && (
                      <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>*</span>
                    )}
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "var(--mono)",
                        color: "var(--muted)",
                        background: "#F3F4F6",
                        padding: "0.1rem 0.3rem",
                        borderRadius: "0.2rem",
                      }}
                    >
                      {field.type}
                    </span>
                  </div>

                  {field.type === "boolean" ? (
                    <select
                      value={String(bodyFields[field.name])}
                      onChange={(e) => updateField(field.name, e.target.value, field.type)}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.6rem",
                        borderRadius: "0.375rem",
                        border: "1px solid var(--border)",
                        fontSize: "0.78rem",
                        fontFamily: "var(--mono)",
                        background: "transparent",
                        color: "var(--fg)",
                        outline: "none",
                      }}
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={String(bodyFields[field.name])}
                      onChange={(e) => updateField(field.name, e.target.value, field.type)}
                      placeholder={`Enter ${field.name}...`}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.6rem",
                        borderRadius: "0.375rem",
                        border: "1px solid var(--border)",
                        fontSize: "0.78rem",
                        fontFamily: "var(--mono)",
                        background: "transparent",
                        color: "var(--fg)",
                        outline: "none",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL preview */}
        <div
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "0.375rem",
            background: "#F3F4F6",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "var(--mono)",
              fontWeight: 600,
              color: METHOD_COLORS[method].text,
              flexShrink: 0,
            }}
          >
            {method}
          </span>
          <span
            style={{
              fontSize: "0.72rem",
              fontFamily: "var(--mono)",
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {url}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "0.6rem 0.75rem",
              borderRadius: "0.375rem",
              background: "#FEF2F2",
              color: "#DC2626",
              fontSize: "0.78rem",
              marginBottom: "0.75rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Fire button */}
        <button
          onClick={fire}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "0.5rem",
            border: "none",
            background: loading ? "#A5B4FC" : "var(--accent)",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            marginBottom: "1rem",
          }}
        >
          {loading ? "Sending request..." : `Send ${method} Request`}
        </button>

        {/* Response */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Status bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      color: statusColor,
                    }}
                  >
                    {response.status}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {STATUS_EXPLANATIONS[response.status] ?? "Response received"}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: "var(--mono)",
                    color: "var(--muted)",
                  }}
                >
                  {response.time}ms
                </span>
              </div>

              {/* Response body */}
              <pre
                style={{
                  margin: 0,
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  background: "#0D0D0D",
                  color: "#10B981",
                  fontFamily: "var(--mono)",
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                  overflowX: "auto",
                  maxHeight: "16rem",
                  overflowY: "auto",
                }}
              >
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}