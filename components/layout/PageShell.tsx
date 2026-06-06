import { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", paddingTop: "5rem" }}>
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
        {children}
      </div>
    </div>
  );
}
