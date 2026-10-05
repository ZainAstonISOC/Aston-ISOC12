import type { Metadata } from "next";

// Never indexed, never cached by a shared cache — every admin view is per-user.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Aston ISOC Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
