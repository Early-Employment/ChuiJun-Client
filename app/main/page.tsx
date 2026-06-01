import { HeroSection } from "@/widgets/main/ui/hero-section";
import { ProblemBoard } from "@/widgets/main/ui/problem-board";
import { ProfileSidebar } from "@/widgets/main/ui/profile-sidebar";

export default function MainPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <HeroSection />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-4 py-9 sm:px-8 xl:px-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <ProblemBoard />
          <ProfileSidebar />
        </div>
      </main>
    </div>
  );
}
