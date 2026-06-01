import type { ReactNode } from "react";
import NavigationHeader from "@/shared/ui/header-navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface-subtle">
      <NavigationHeader />
      <div className="w-full pt-12">{children}</div>
    </div>
  );
}
