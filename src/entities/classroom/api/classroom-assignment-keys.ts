import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/shared/api/instance";
import { mapClassroomAssignments } from "@/entities/classroom/api/classroom-api-mapper";
import type { ClassroomAssignmentResponse } from "@/entities/classroom/api/classroom-api-response";

// GET /classrooms/{classroomId}/assignments — 학급별 과제 목록.
export const classroomAssignmentKeys = {
  all: ["classroom-assignment"] as const,
  list: (classroomId: number) =>
    queryOptions({
      queryKey: [...classroomAssignmentKeys.all, "list", classroomId] as const,
      queryFn: async () =>
        mapClassroomAssignments(
          (
            await instance.get<ClassroomAssignmentResponse[]>(
              `/classrooms/${classroomId}/assignments`,
            )
          ).data,
        ),
    }),
};
