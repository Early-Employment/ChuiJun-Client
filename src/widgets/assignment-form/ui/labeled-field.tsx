export function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex w-full flex-col gap-3">
      <span className="text-foreground pl-1 text-xl font-semibold">{label}</span>
      {children}
    </label>
  );
}
