"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Field = { name: string; type: string; required: boolean };
type Resource = { name: string; fields: Field[] };
type Schema = { name: string; description: string; resources: Resource[] };

interface SchemaEditorProps {
  schema: Schema;
  onChange: (schema: Schema) => void;
}

const FIELD_TYPES = ["string", "number", "boolean"];

const TYPE_EXPLANATIONS: Record<string, string> = {
  string: "text — names, emails, descriptions",
  number: "a numeric value — age, price, quantity",
  boolean: "true or false — is_active, is_verified",
};

export default function SchemaEditor({ schema, onChange }: SchemaEditorProps) {
  const [expandedResource, setExpandedResource] = useState<string | null>(
    schema.resources[0]?.name ?? null
  );

  function updateResourceName(resourceIndex: number, newName: string) {
    const updated = { ...schema };
    updated.resources = [...schema.resources];
    updated.resources[resourceIndex] = {
      ...updated.resources[resourceIndex],
      name: newName.toLowerCase().replace(/\s+/g, "_"),
    };
    onChange(updated);
  }

  function updateField(
    resourceIndex: number,
    fieldIndex: number,
    key: keyof Field,
    value: string | boolean
  ) {
    const updated = { ...schema };
    updated.resources = schema.resources.map((r, ri) => {
      if (ri !== resourceIndex) return r;
      return {
        ...r,
        fields: r.fields.map((f, fi) => {
          if (fi !== fieldIndex) return f;
          return { ...f, [key]: value };
        }),
      };
    });
    onChange(updated);
  }

  function addField(resourceIndex: number) {
    const updated = { ...schema };
    updated.resources = schema.resources.map((r, ri) => {
      if (ri !== resourceIndex) return r;
      return {
        ...r,
        fields: [...r.fields, { name: "new_field", type: "string", required: false }],
      };
    });
    onChange(updated);
  }

  function deleteField(resourceIndex: number, fieldIndex: number) {
    const updated = { ...schema };
    updated.resources = schema.resources.map((r, ri) => {
      if (ri !== resourceIndex) return r;
      return {
        ...r,
        fields: r.fields.filter((_, fi) => fi !== fieldIndex),
      };
    });
    onChange(updated);
  }

  return (
    <div>
      {/* Schema name & description */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontFamily: "var(--mono)",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.3rem",
              }}
            >
              API Name
            </label>
            <input
              value={schema.name}
              onChange={(e) => onChange({ ...schema, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                fontWeight: 500,
                background: "transparent",
                color: "var(--fg)",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontFamily: "var(--mono)",
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.3rem",
              }}
            >
              Description
            </label>
            <input
              value={schema.description}
              onChange={(e) => onChange({ ...schema, description: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                fontSize: "0.875rem",
                background: "transparent",
                color: "var(--fg)",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Resources */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {schema.resources.map((resource, ri) => (
          <motion.div
            key={ri}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.06 }}
            style={{
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {/* Resource header */}
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "#FAFAF9",
                borderBottom: expandedResource === resource.name ? "1px solid var(--border)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
              }}
              onClick={() =>
                setExpandedResource(
                  expandedResource === resource.name ? null : resource.name
                )
              }
            >
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                /
              </span>
              <input
                value={resource.name}
                onChange={(e) => {
                  e.stopPropagation();
                  updateResourceName(ri, e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flex: 1,
                  fontFamily: "var(--mono)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "var(--mono)",
                  color: "var(--muted)",
                  flexShrink: 0,
                }}
              >
                {resource.fields.length} fields
              </span>
              <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                {expandedResource === resource.name ? "▲" : "▼"}
              </span>
            </div>

            {/* Fields */}
            <AnimatePresence>
              {expandedResource === resource.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0.75rem 1rem" }}>

                    {/* Auto id field — read only */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.4rem 0.6rem",
                        borderRadius: "0.375rem",
                        background: "#F9F8F6",
                        marginBottom: "0.5rem",
                        opacity: 0.6,
                      }}
                    >
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.78rem", color: "var(--fg)", flex: 1 }}>
                        id
                      </span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--muted)", background: "#F3F4F6", padding: "0.1rem 0.4rem", borderRadius: "0.2rem" }}>
                        string
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontStyle: "italic" }}>
                        auto-generated
                      </span>
                    </div>

                    {/* Editable fields */}
                    {resource.fields.map((field, fi) => (
                      <motion.div
                        key={fi}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: fi * 0.04 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                          padding: "0.4rem 0.6rem",
                          borderRadius: "0.375rem",
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                        }}
                      >
                        {/* Field name */}
                        <input
                          value={field.name}
                          onChange={(e) => updateField(ri, fi, "name", e.target.value)}
                          style={{
                            flex: 1,
                            fontFamily: "var(--mono)",
                            fontSize: "0.78rem",
                            color: "var(--fg)",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            padding: 0,
                            minWidth: 0,
                          }}
                        />

                        {/* Type selector */}
                        <select
                          value={field.type}
                          onChange={(e) => updateField(ri, fi, "type", e.target.value)}
                          title={TYPE_EXPLANATIONS[field.type]}
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.72rem",
                            color: "var(--muted)",
                            background: "#F3F4F6",
                            border: "none",
                            borderRadius: "0.2rem",
                            padding: "0.15rem 0.3rem",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>

                        {/* Required toggle */}
                        <button
                          onClick={() => updateField(ri, fi, "required", !field.required)}
                          title={field.required ? "Click to make optional" : "Click to make required"}
                          style={{
                            fontSize: "0.65rem",
                            fontFamily: "var(--mono)",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "0.2rem",
                            border: "none",
                            background: field.required ? "var(--accent-light)" : "#F3F4F6",
                            color: field.required ? "var(--accent)" : "var(--muted)",
                            cursor: "pointer",
                            flexShrink: 0,
                            transition: "all 0.15s",
                          }}
                        >
                          {field.required ? "required" : "optional"}
                        </button>

                        {/* Delete field */}
                        <button
                          onClick={() => deleteField(ri, fi)}
                          style={{
                            fontSize: "0.75rem",
                            color: "#DC2626",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            flexShrink: 0,
                            opacity: 0.5,
                            lineHeight: 1,
                            padding: "0 0.1rem",
                          }}
                          title="Delete this field"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}

                    {/* Add field button */}
                    <button
                      onClick={() => addField(ri)}
                      style={{
                        width: "100%",
                        padding: "0.4rem",
                        borderRadius: "0.375rem",
                        border: "1px dashed var(--border)",
                        background: "transparent",
                        color: "var(--muted)",
                        fontSize: "0.78rem",
                        fontFamily: "var(--mono)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        marginTop: "0.25rem",
                      }}
                    >
                      + add field
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}