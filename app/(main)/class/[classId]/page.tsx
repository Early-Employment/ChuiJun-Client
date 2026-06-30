import { ClassroomRouteWidget } from "@/widgets/classroom/ui/classroom-route-widget";

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;

  return <ClassroomRouteWidget classroomId={classId} />;
}
