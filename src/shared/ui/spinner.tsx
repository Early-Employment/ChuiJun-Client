export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="border-accent animate-spin rounded-full border-2 border-t-transparent"
    />
  );
}
