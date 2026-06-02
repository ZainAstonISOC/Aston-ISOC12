import { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#0D1025", minHeight: "100vh", paddingTop: "5rem" }}>
      <div className="container py-20">{children}</div>
    </div>
  );
}
