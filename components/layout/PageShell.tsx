import { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    // Clamped rather than fixed so interior pages clear the navbar by the same
    // proportion as the home hero does at every width.
    <div style={{ minHeight: "100vh" }}>
      <div
        className="container"
        style={{
          paddingTop: "clamp(7rem, 13vw, 9.5rem)",
          paddingBottom: "clamp(4rem, 9vw, 7rem)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
