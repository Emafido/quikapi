"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodeSnippetProps {
  baseUrl: string;
  resource: string;
  fields: { name: string; type: string; required: boolean }[];
}

type Method = "GET" | "POST" | "PUT" | "DELETE";
type Flavor = "fetch" | "axios" | "curl";

function getSampleBody(fields: { name: string; type: string; required: boolean }[]) {
  const obj: Record<string, unknown> = {};
  fields.forEach((f) => {
    if (f.type === "string") obj[f.name] = `"example_${f.name}"`;
    else if (f.type === "number") obj[f.name] = 1;
    else if (f.type === "boolean") obj[f.name] = true;
  });
  return obj;
}

function buildSnippet(
  flavor: Flavor,
  method: Method,
  url: string,
  fields: { name: string; type: string; required: boolean }[]
): string {
  const body = getSampleBody(fields);
  const bodyStr = JSON.stringify(body, null, 2).replace(/"example_(\w+)"/g, '"your_$1_here"');
  const hasBody = method === "POST" || method === "PUT";
  const fullUrl = method === "PUT" || method === "DELETE"
    ? `${url}?recordId=YOUR_RECORD_ID`
    : url;

  if (flavor === "fetch") {
    if (!hasBody) {
      return `// fetch() sends an HTTP request and returns the response
const response = await fetch("${fullUrl}", {
  method: "${method}", // we're reading data, no body needed
});

// .json() parses the response into a JavaScript object
const data = await response.json();

console.log(data);`;
    }
    return `// The body is the data we're sending to the API
const body = ${bodyStr};

const response = await fetch("${fullUrl}", {
  method: "${method}",
  headers: {
    // Tell the API we're sending JSON data
    "Content-Type": "application/json",
  },
  // JSON.stringify converts our object to a JSON string
  body: JSON.stringify(body),
});

const data = await response.json();

console.log(data);`;
  }

  if (flavor === "axios") {
    if (!hasBody) {
      return `// axios is a popular library that simplifies HTTP requests
// Install it with: npm install axios
import axios from "axios";

// axios.get() sends a GET request and returns the response
const { data } = await axios.get("${fullUrl}");

// data is already parsed — no need to call .json()
console.log(data);`;
    }
    return `import axios from "axios";

// The body is the data we're sending to the API
const body = ${bodyStr};

// axios.${method.toLowerCase()}() sends a ${method} request
const { data } = await axios.${method.toLowerCase()}(
  "${fullUrl}",
  body // axios automatically sets Content-Type to application/json
);

console.log(data);`;
  }

  if (flavor === "curl") {
    if (!hasBody) {
      return `# curl is a command-line tool for making HTTP requests
# -X sets the HTTP method
# Run this in your terminal
curl -X ${method} "${fullUrl}"`;
    }
    return `# -H sets a request header (we're sending JSON)
# -d is the request body data
curl -X ${method} "${fullUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body)}'`;
  }

  return "";
}

const METHOD_COLORS: Record<Method, { bg: string; text: string }> = {
  GET:    { bg: "#ECFDF5", text: "#059669" },
  POST:   { bg: "#EFF6FF", text: "#2563EB" },
  PUT:    { bg: "#FFFBEB", text: "#D97706" },
  DELETE: { bg: "#FEF2F2", text: "#DC2626" },
};

const METHODS: Method[] = ["GET", "POST", "PUT", "DELETE"];
const FLAVORS: Flavor[] = ["fetch", "axios", "curl"];

const METHOD_EXPLANATIONS: Record<Method, string> = {
  GET:    "Fetches data from the API — like asking \"show me all records\"",
  POST:   "Creates a new record — like filling out a form and submitting it",
  PUT:    "Updates an existing record — like editing a saved document",
  DELETE: "Removes a record permanently — like deleting a file",
};

export default function CodeSnippet({ baseUrl, resource, fields }: CodeSnippetProps) {
  const [method, setMethod] = useState<Method>("GET");
  const [flavor, setFlavor] = useState<Flavor>("fetch");
  const [copied, setCopied] = useState(false);

  const url = `${baseUrl}/${resource}`;
  const snippet = buildSnippet(flavor, method, url, fields);

  function copy() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginTop: "0.75rem", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid var(--border)" }}>

      {/* Method Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "#FAFAF9" }}>
        {METHODS.map((m) => {
          const colors = METHOD_COLORS[m];
          const active = method === m;
          return (
            <button
              key={m}
              onClick={() => setMethod(m)}
              style={{
                flex: 1,
                padding: "0.5rem 0",
                fontSize: "0.72rem",
                fontFamily: "var(--mono)",
                fontWeight: 600,
                border: "none",
                borderBottom: active ? `2px solid ${colors.text}` : "2px solid transparent",
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

      {/* Method explanation */}
      <div style={{ padding: "0.6rem 1rem", background: "#FAFAF9", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontStyle: "italic" }}>
          {METHOD_EXPLANATIONS[method]}
        </p>
      </div>

      {/* Flavor Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 1rem 0", background: "#0D0D0D" }}>
        {FLAVORS.map((f) => (
          <button
            key={f}
            onClick={() => setFlavor(f)}
            style={{
              fontSize: "0.72rem",
              fontFamily: "var(--mono)",
              padding: "0.2rem 0.6rem",
              borderRadius: "0.25rem",
              border: "none",
              background: flavor === f ? "var(--accent)" : "#2A2A2A",
              color: flavor === f ? "#fff" : "#9CA3AF",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {f}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={copy}
          style={{
            fontSize: "0.72rem",
            fontFamily: "var(--mono)",
            padding: "0.2rem 0.6rem",
            borderRadius: "0.25rem",
            border: "none",
            background: copied ? "#059669" : "#2A2A2A",
            color: copied ? "#fff" : "#9CA3AF",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>

      {/* Code Block */}
      <AnimatePresence mode="wait">
        <motion.pre
          key={`${method}-${flavor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            margin: 0,
            padding: "1rem",
            background: "#0D0D0D",
            color: "#E5E7EB",
            fontFamily: "var(--mono)",
            fontSize: "0.75rem",
            lineHeight: 1.7,
            overflowX: "auto",
            whiteSpace: "pre",
          }}
        >
          {snippet.split("\n").map((line, i) => {
            const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
            return (
              <span key={i} style={{ display: "block", color: isComment ? "#6B7280" : "#E5E7EB" }}>
                {line || " "}
              </span>
            );
          })}
        </motion.pre>
      </AnimatePresence>
    </div>
  );
}