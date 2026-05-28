"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const activeStyle = { fontWeight: "500" as const, opacity: 1 };
  const inactiveStyle = { fontWeight: "400" as const, opacity: 0.6 };

  return (
    <nav style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)", position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem", height: "3.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", color: "var(--fg)" }}>QuikAPI</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", padding: "0.125rem 0.375rem", borderRadius: "0.25rem", background: "var(--accent-light)", color: "var(--accent)" }}>beta</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/" style={{ fontSize: "0.875rem", color: "var(--fg)", textDecoration: "none", ...(path === "/" ? activeStyle : inactiveStyle) }}>Builder</Link>
          <Link href="/dashboard" style={{ fontSize: "0.875rem", color: "var(--fg)", textDecoration: "none", ...(path === "/dashboard" ? activeStyle : inactiveStyle) }}>My APIs</Link>
          <a href="https://docs.quikdb.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem", color: "var(--muted)", textDecoration: "none" }}>Docs</a>
        </div>

      </div>
    </nav>
  );
}