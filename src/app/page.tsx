"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Builder from "@/components/Builder";
import EndpointList from "@/components/EndpointList";

type Schema = {
  name: string;
  description: string;
  resources: {
    name: string;
    fields: { name: string; type: string; required: boolean }[];
  }[];
};

export default function Home() {
  const [deployed, setDeployed] = useState<{
    apiId: string;
    schema: Schema;
  } | null>(null);

  function handleDeploy(apiId: string, schema: Schema) {
    setDeployed({ apiId, schema });
    setTimeout(() => {
      document
        .getElementById("endpoints")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section
        className="dot-grid"
        style={{ paddingTop: "8rem", paddingBottom: "5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--muted)",
                fontFamily: "var(--mono)",
                fontSize: "0.75rem",
              }}
            >
              <span style={{ width: "0.375rem", height: "0.375rem", borderRadius: "9999px", background: "#10B981", display: "inline-block" }} />
              Powered by Groq · Deployed on QuikDB
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h1
              className="font-serif"
              style={{
                fontSize: "clamp(3rem, 8vw, 5rem)",
                lineHeight: 1.1,
                color: "var(--fg)",
                marginBottom: "1.25rem",
              }}
            >
              Describe an API.
              <br />
              <em>Get a live one.</em>
            </h1>
            <p style={{ fontSize: "1rem", color: "var(--muted)", maxWidth: "28rem", margin: "0 auto" }}>
              Type what you need in plain English. QuikAPI generates the schema,
              creates the endpoints, and hands you live URLs in seconds.
            </p>
          </motion.div>

          {/* Builder */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ maxWidth: "42rem", margin: "0 auto" }}
          >
            <Builder onDeploy={handleDeploy} />
          </motion.div>

          {/* Endpoints */}
          {deployed && (
            <div id="endpoints" style={{ maxWidth: "42rem", margin: "0 auto" }}>
              <EndpointList apiId={deployed.apiId} schema={deployed.schema} />
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: "1px solid var(--border)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <h2
            className="font-serif"
            style={{ fontSize: "2rem", color: "var(--fg)", textAlign: "center", marginBottom: "3rem" }}
          >
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "01", title: "Describe", body: "Type what your API should do in plain English. No technical jargon required." },
              { step: "02", title: "Generate", body: "AI parses your description and produces a clean, structured schema with resources and fields." },
              { step: "03", title: "Deploy", body: "One click. Your API is live with full CRUD endpoints ready to accept real requests." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                }}
              >
                <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--accent)" }}>
                  {item.step}
                </span>
                <h3 className="font-serif" style={{ fontSize: "1.35rem", margin: "0.5rem 0 0.5rem" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}