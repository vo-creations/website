import type { CreatorStatus } from "../data";

const statusConfig: Record<CreatorStatus, { label: string; bg: string; text: string; dot: string }> = {
  ON_TRACK: { label: "ON TRACK", bg: "bg-white/10", text: "text-white", dot: "bg-white" },
  WATCH: { label: "WATCH", bg: "bg-white/5", text: "text-[#bdbdb8]", dot: "bg-[#bdbdb8]" },
  SLOW: { label: "SLOW", bg: "bg-white/5", text: "text-text-dim", dot: "bg-text-dim" },
};

export function StatusPill({ status }: { status: CreatorStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
