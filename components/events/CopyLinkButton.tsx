"use client";
import { useState } from "react";

/** Copies a URL to the clipboard; falls back to selecting it if the API is blocked. */
export default function CopyLinkButton({ url, label = "Copy link" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-ghost" aria-live="polite">
      {copied ? "Copied ✓" : label}
    </button>
  );
}
