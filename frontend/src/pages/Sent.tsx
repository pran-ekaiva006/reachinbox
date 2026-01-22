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
    const fetchData = () => {
      api
        .get("/emails/sent")
        .then(res => setEmails(res.data))
        .catch(() => setError("Failed to load sent emails"))
        .finally(() => setLoading(false));
    };

    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <p>Loading sent emails…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Sent Emails</h1>

      {emails.length === 0 ? (
        <p>No sent emails</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>To</th>
              <th>Subject</th>
              <th>Sent At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map(e => (
              <tr key={e.id}>
                <td>{e.toEmail}</td>
                <td>{e.subject}</td>
                <td>{new Date(e.sentAt).toLocaleString()}</td>
                <td>{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
