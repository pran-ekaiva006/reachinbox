import { useState } from "react";
import { api } from "../api/client";

export default function Scheduler() {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!toEmail || !subject || !body || !scheduledAt) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/emails/schedule", {
        userId: "u1",               // demo user
        senderId: "s1",             // demo sender
        toEmail,
        subject,
        body,
        scheduledAt,
        idempotencyKey: `ui-${Date.now()}`
      });

      setSuccess(true);
      setToEmail("");
      setSubject("");
      setBody("");
      setScheduledAt("");
    } catch {
      setError("Failed to schedule email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold">Schedule New Email</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border bg-white p-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="email"
            value={toEmail}
            onChange={e => setToEmail(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="recipient@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Email subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            rows={5}
            placeholder="Write your email…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Schedule Time
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">
            Email scheduled successfully
          </p>
        )}

        <button
          disabled={loading}
          className="w-full rounded bg-black py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Scheduling…" : "Schedule Email"}
        </button>
      </form>
    </div>
  );
}