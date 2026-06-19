import { BookOpenIcon } from "@/shared/assets/BookOpenIcon";
import { UsersIcon } from "@/shared/assets/UsersIcon";

export type SolveTab = "problem" | "friends";

interface Props {
  active: SolveTab;
  onChange: (tab: SolveTab) => void;
}

export function SolveTabs({ active, onChange }: Props) {
  return (
    <div className="bg-line inline-flex gap-1 rounded-md p-1">
      <TabButton active={active === "problem"} onClick={() => onChange("problem")}>
        <BookOpenIcon className="size-3" />
        문제
      </TabButton>
      <TabButton active={active === "friends"} onClick={() => onChange("friends")}>
        <UsersIcon className="size-3" />
        친구 풀이 보기
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-2 py-[5px] text-sm font-medium ${
        active ? "bg-surface text-foreground" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}
