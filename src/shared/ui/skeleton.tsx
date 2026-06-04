export function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-muted/20 animate-pulse rounded ${className}`} />;
}
