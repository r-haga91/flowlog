"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="nb"><body style={{ margin: 0, background: "#07111f", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><div style={{ maxWidth: 520, textAlign: "center" }}><h1>Noe gikk galt</h1><p style={{ color: "#94a3b8", lineHeight: 1.6 }}>FlowLog kunne ikke starte som forventet. Prøv én gang til.</p><button type="button" onClick={reset} style={{ marginTop: 16, border: 0, borderRadius: 14, padding: "14px 20px", fontWeight: 700, cursor: "pointer" }}>Prøv igjen</button></div></main></body></html>;
}
