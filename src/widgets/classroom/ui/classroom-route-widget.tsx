"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { classroomViewerKeys } from "@/entities/classroom/api/classroom-viewer-keys";
import { ClassroomPageWidgetBoundary } from "@/widgets/classroom/ui/classroom-page-widget";
import { StudentClassroomPageWidgetBoundary } from "@/widgets/classroom/ui/student-classroom-page-widget";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";

/**
 * /class 라우트를 사용자 역할(teacher/student)에 따라 분기한다.
 * 역할 조회는 가볍게 끝나므로, 실제 학급 데이터의 로딩/에러는 각 역할별 위젯의 Boundary가 담당한다.
 */
function ClassroomRouteSwitch({ classroomId }: { classroomId: string }) {
  const { data } = useSuspenseQuery(classroomViewerKeys.current());

  if (data.role === "teacher") {
    return <ClassroomPageWidgetBoundary classroomId={classroomId} />;
  }

  return <StudentClassroomPageWidgetBoundary />;
}

function ClassroomRouteError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex min-h-[480px] flex-col items-center justify-center gap-2 px-4 text-sm">
      <p>학급 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

export function ClassroomRouteWidget({ classroomId }: { classroomId: string }) {
  return (
    <QueryBoundary loadingFallback={null} errorFallback={ClassroomRouteError}>
      <ClassroomRouteSwitch classroomId={classroomId} />
    </QueryBoundary>
  );
}
