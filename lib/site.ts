// Public contact addresses. Swap this list if they change.
// public/llms.txt repeats them and has to be updated by hand.
export const CONTACT_EMAILS = ["daniel@vocreations.com", "thienvu@vocreations.com"] as const;

export function contactEmailsLabel(): string {
  return CONTACT_EMAILS.join(" and ");
}
