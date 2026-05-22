export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="animate-spin rounded-full border-2 border-accent border-t-transparent"
    />
  );
}
