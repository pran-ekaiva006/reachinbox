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

  useEffect(() => {
    api.get("/emails/scheduled").then(res => setEmails(res.data));
  }, []);

  return (
    <div>
      <h1>Scheduled Emails</h1>
      <ul>
        {emails.map(e => (
          <li key={e.id}>
            {e.toEmail} — {e.subject} — {e.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
