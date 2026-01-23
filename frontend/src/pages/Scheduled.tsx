import { useState } from "react";

export default function Scheduled() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body || !scheduleTime) {
      alert("All fields are required");
      return;
    }

    console.log({ to, subject, body, scheduleTime });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule New Email</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create and schedule an email campaign to be sent later
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Email Body
            </label>
            <textarea
              id="body"
              placeholder="Write your email here..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
            />
          </div>

          <div>
            <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Time
            </label>
            <input
              id="scheduleTime"
              type="datetime-local"
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule Email
          </button>
        </form>
      </div>
    </div>
  );
}