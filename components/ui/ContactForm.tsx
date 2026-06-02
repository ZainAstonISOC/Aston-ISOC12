"use client";

import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL: FormState = { name: "", email: "", subject: "", message: "" };

const SUBJECTS = [
  "General Enquiry",
  "Freshers Info",
  "Membership",
  "Event Enquiry",
  "Sponsorship & Partnership",
  "Charity Collaboration",
  "Media & Press",
  "Committee Application",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    // Placeholder: replace with actual form submission API
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("success");
    setForm(INITIAL);
  };

  const field = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 border border-green-200 rounded-lg bg-green-50">
        <div className="text-3xl mb-3">✅</div>
        <h3 className="font-semibold text-gray-900 mb-1">Message sent!</h3>
        <p className="text-sm text-gray-600 mb-4">We'll get back to you as soon as possible. JazakAllah khayran.</p>
        <button onClick={() => setStatus("idle")} className="text-sm text-blue-600 hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => field("name", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => field("email", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-400" : "border-gray-300"}`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <select
          value={form.subject}
          onChange={(e) => field("subject", e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.subject ? "border-red-400" : "border-gray-300"}`}
        >
          <option value="">Select a subject...</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea
          value={form.message}
          onChange={(e) => field("message", e.target.value)}
          rows={5}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${errors.message ? "border-red-400" : "border-gray-300"}`}
          placeholder="How can we help?"
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium text-sm"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
