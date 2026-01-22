import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";

type Email = {
  id: string;
  toEmail: string;
  subject: string;
  scheduledAt: string;
  status: "scheduled" | "sending";
};

export default function Scheduled() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  const fetchEmails = async (initial = false) => {
    if (initial) setLoading(true);

    try {
      const res = await api.get<Email[]>("/emails/scheduled");
      if (isMounted.current) {
        setEmails(res.data);
        setError(null);
      }
    } catch {
      if (isMounted.current) {
        setError("Failed to load scheduled emails");
      }
    } finally {
      if (initial && isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmails(true);

    const interval = setInterval(() => fetchEmails(false), 5000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading scheduled emails…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Scheduled Emails</h1>

      {emails.length === 0 ? (
        <p className="text-gray-500">No scheduled emails</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">To</th>
                <th className="px-3 py-2 text-left">Subject</th>
                <th className="px-3 py-2 text-left">Scheduled At</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {emails.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="px-3 py-2">{e.toEmail}</td>
                  <td className="px-3 py-2">{e.subject}</td>
                  <td className="px-3 py-2">
                    {new Date(e.scheduledAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 capitalize">
                    <span
                      className={
                        e.status === "sending"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }
                    >
                      {e.status}
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