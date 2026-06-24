import { Header } from "@/widgets/header/ui/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-subtle flex h-dvh flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
