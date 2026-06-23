import { Header } from "@/widgets/header/ui/header";
import { AuthGuard } from "@/shared/ui/auth-guard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-surface-subtle flex h-dvh flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </AuthGuard>
  );
}
