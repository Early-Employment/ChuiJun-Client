import type { ReactNode } from "react";
import NavigationHeader from "@/shared/ui/header-navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationHeader />
      <div className="pt-20">{children}</div>
    </>
  );
}
