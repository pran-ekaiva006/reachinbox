export interface Email {
  id: string;
  toEmail: string;
  subject: string;
  status: "scheduled" | "sent" | "failed";
  scheduledAt?: string;
  sentAt?: string;
}