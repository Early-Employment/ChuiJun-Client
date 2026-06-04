export function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m12 3 7 9-7 9-7-9 7-9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m12 8 3 4-3 4-3-4 3-4Z" fill="currentColor" />
    </svg>
  );
}
