import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Email = {
  id: string;
  toEmail: string;
  subject: string;
  sentAt: string;
  status: string;
};

export default function Sent() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/emails/sent")
      .then(res => setEmails(res.data))
      .catch(() => setError("Failed to load sent emails"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sent emails…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Sent Emails</h1>

      {emails.length === 0 ? (
        <p>No sent emails</p>
      ) : (
        <ul>
          {emails.map(e => (
            <li key={e.id}>
              <strong>{e.toEmail}</strong> — {e.subject} —{" "}
              {new Date(e.sentAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
