import { ActivityRecordCard } from "@/widgets/mypage/ui/activity-record-card";
import { CategorySolveStatusCard } from "@/widgets/mypage/ui/category-solve-status-card";
import { EarnedBadgeCard } from "@/widgets/mypage/ui/earned-badge-card";
import { ProfileStatCards } from "@/widgets/mypage/ui/profile-stat-cards";
import { ProfileSummaryCard } from "@/widgets/mypage/ui/profile-summary-card";
import { Header } from "@/widgets/header/ui/header";
import { ClassGroupCard } from "@/widgets/class-group/ui/class-group-card";
import { WrongProblemTable } from "@/widgets/wrong-problem-table/ui/wrong-problem-table";

export default function MyPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <Header />
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-9">
        <ProfileSummaryCard />
        <ProfileStatCards />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
          <div className="space-y-8">
            <ActivityRecordCard />
            <WrongProblemTable />
          </div>
          <aside className="space-y-8">
            <EarnedBadgeCard />
            <ClassGroupCard />
            <CategorySolveStatusCard />
          </aside>
        </div>
      </div>
    </main>
  );
}
