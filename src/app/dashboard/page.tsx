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

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl" style={{ color: "var(--fg)" }}>
              My APIs
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {apis.length} deployed {apis.length === 1 ? "API" : "APIs"}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-xl font-medium transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            + New API
          </Link>
        </div>

        {loading ? (
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Loading...
          </div>
        ) : apis.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="font-serif text-2xl mb-2">Nothing here yet</p>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              Generate and deploy your first API from the builder.
            </p>
            <Link
              href="/"
              className="text-sm px-4 py-2 rounded-xl font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Open Builder →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {apis.map((api, i) => {
              const schema = JSON.parse(api.schema);
              const base = `${getBaseUrl()}/api/live/${api.id}`;
              return (
                <motion.div
                  key={api.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-5 rounded-2xl"
                  style={{ border: "1px solid var(--border)", background: "var(--card)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-sm">{api.name}</h3>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--muted)" }}
                      >
                        {api.description}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteApi(api.id)}
                      className="text-xs transition-colors"
                      style={{ color: "var(--muted)" }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {schema.resources.map((r: { name: string }) => (
                      <span
                        key={r.name}
                        className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{
                          background: "var(--accent-light)",
                          color: "var(--accent)",
                        }}
                      >
                        /{r.name}
                      </span>
                    ))}
                  </div>

                  <div
                    className="p-2.5 rounded-lg font-mono text-xs truncate mb-3"
                    style={{ background: "#F3F4F6", color: "var(--muted)" }}
                  >
                    {base}
                  </div>

                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Created {formatDate(api.createdAt ?? "")}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}