import { classNames } from "@/shared/lib/class-names";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "animate-pulse rounded bg-text-secondary/20",
        className,
      )}
    />
  );
}
