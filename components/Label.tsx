export default function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-5 flex items-center gap-3 text-[13px] font-medium leading-[1.3] text-text-dim">
      <span className="h-px w-10 bg-text-dim" aria-hidden="true" />
      {children}
    </span>
  );
}
