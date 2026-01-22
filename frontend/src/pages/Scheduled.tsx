import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

type Email = {
  id: string;
  toEmail: string;
  subject: string;
  sentAt: string;
  status: "sent" | "failed";
};

export default function Sent() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const fetchEmails = async (initial = false) => {
    if (initial) setLoading(true);

    try {
      const res = await api.get<Email[]>("/emails/sent");
      if (mounted.current) {
        setEmails(res.data);
        setError(null);
      }
    } catch {
      if (mounted.current) {
        setError("Failed to load sent emails");
      }
    } finally {
      if (initial && mounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmails(true);
    const interval = setInterval(() => fetchEmails(false), 5000);

    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading sent emails…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sent Emails</h2>

      {emails.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
          No sent emails yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">To</th>
                <th className="px-4 py-3 text-left font-medium">Subject</th>
                <th className="px-4 py-3 text-left font-medium">Sent Time</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.map(email => (
                <tr key={email.id} className="border-t">
                  <td className="px-4 py-3">{email.toEmail}</td>
                  <td className="px-4 py-3">{email.subject}</td>
                  <td className="px-4 py-3">
                    {new Date(email.sentAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={
                        email.status === "sent"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {email.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}