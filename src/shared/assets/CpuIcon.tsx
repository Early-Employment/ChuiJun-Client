export function CpuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
