import { useEffect, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;

    api
      .get<Email[]>("/emails/sent")
      .then(res => {
        if (!cancelled) setEmails(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load sent emails");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sent Emails</h2>

      {emails.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
          No sent emails yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Sent At</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-3">{e.toEmail}</td>
                  <td className="px-4 py-3">{e.subject}</td>
                  <td className="px-4 py-3">
                    {new Date(e.sentAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-green-600">{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}