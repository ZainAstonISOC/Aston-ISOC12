"use client";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="field-wrap" style={{ marginBottom: 0 }}>
        <label htmlFor="password">Committee password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>
      {state.error && (
        <p id="login-error" role="alert" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#fca5a5" }}>
          {state.error}
        </p>
      )}
      <button type="submit" className="btn btn-gold" disabled={pending}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
