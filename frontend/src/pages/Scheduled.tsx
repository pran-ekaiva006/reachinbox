import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Email = {
  id: string;
  toEmail: string;
  subject: string;
  scheduledAt: string;
  status: string;
};

export default function Scheduled() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/emails/scheduled")
      .then(res => setEmails(res.data))
      .catch(() => setError("Failed to load scheduled emails"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading scheduled emails…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Scheduled Emails</h1>

      {emails.length === 0 ? (
        <p>No scheduled emails</p>
      ) : (
        <ul>
          {emails.map(e => (
            <li key={e.id}>
              <strong>{e.toEmail}</strong> — {e.subject} —{" "}
              {new Date(e.scheduledAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
