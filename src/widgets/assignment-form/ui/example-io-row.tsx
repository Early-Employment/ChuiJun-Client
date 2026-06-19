const exampleFieldClassName =
  "border-line-strong bg-surface text-foreground placeholder:text-muted focus:border-accent min-h-[62px] w-full resize-none rounded-md border px-4 py-3 text-base font-medium outline-none";

const exampleValue = "[[-1, 3], [7, 3], [1, -1], [-2, 6]]";

export function ExampleIoRow({
  inputLabel,
  outputLabel,
}: {
  inputLabel: string;
  outputLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <label className="flex flex-col gap-2">
        <span className="text-foreground text-xl font-semibold">{inputLabel}</span>
        <textarea rows={2} placeholder={exampleValue} className={exampleFieldClassName} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-foreground text-xl font-semibold">{outputLabel}</span>
        <textarea rows={2} placeholder={exampleValue} className={exampleFieldClassName} />
      </label>
    </div>
  );
}
