export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="loading"
      style={{ width: size, height: size }}
      className="animate-spin rounded-full border-2 border-primary-500 border-t-transparent"
    />
  );
}
