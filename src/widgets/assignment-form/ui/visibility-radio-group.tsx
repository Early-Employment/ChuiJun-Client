const options = [
  { value: "public", label: "모두에게 공개" },
  { value: "private", label: "나에게만 공개" },
] as const;

export function VisibilityRadioGroup() {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-foreground text-xl font-semibold">공개 여부</legend>
      <div className="flex flex-wrap gap-5">
        {options.map((option) => (
          <label
            key={option.value}
            className="text-muted flex items-center gap-2 p-1 text-base font-medium"
          >
            <input
              type="radio"
              name="visibility"
              value={option.value}
              defaultChecked={option.value === "private"}
              className="accent-primary-500 size-5"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
