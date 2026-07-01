import { ActivityRecordCard } from "@/widgets/mypage/ui/activity-record-card";
import { ProfileStatCardsBoundary } from "@/widgets/mypage/ui/profile-stat-cards";
import { ProfileSummaryCardBoundary } from "@/widgets/mypage/ui/profile-summary-card";
import { RecentActivityCardBoundary } from "@/widgets/mypage/ui/recent-activity-card";
import { ClassGroupCard } from "@/widgets/class-group/ui/class-group-card";
import { WrongProblemTable } from "@/widgets/wrong-problem-table/ui/wrong-problem-table";

export default function MyPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-9 sm:px-6">
      <ProfileSummaryCardBoundary />
      <ProfileStatCardsBoundary />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <aside className="min-w-0 space-y-8 lg:order-2">
          <RecentActivityCardBoundary />
          <ClassGroupCard />
        </aside>
        <div className="min-w-0 space-y-8 lg:order-1">
          <ActivityRecordCard />
          <WrongProblemTable />
        </div>
      </div>
    </main>
  );
}
