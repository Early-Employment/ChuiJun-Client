import { instance } from "@/shared/api/instance";
import { getMemberId } from "@/shared/api/member-session-store";
import type {
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from "@/entities/assignment/api/assignment-api-request";

// 과제 출제/수정/삭제 mutation. requestorId(쿼리 파라미터)는 로그인 멤버에서 채운다.
export const assignmentKeys = {
  all: ["assignment"] as const,
  create: (classroomId: number) => ({
    mutationKey: [...assignmentKeys.all, "create", classroomId] as const,
    mutationFn: async (body: CreateAssignmentRequest): Promise<number> =>
      (
        await instance.post<number>(`/classrooms/${classroomId}/assignments`, body, {
          params: { requestorId: getMemberId() },
        })
      ).data,
  }),
  update: (assignmentId: number) => ({
    mutationKey: [...assignmentKeys.all, "update", assignmentId] as const,
    mutationFn: async (body: UpdateAssignmentRequest): Promise<void> => {
      await instance.put(`/assignments/${assignmentId}`, body, {
        params: { requestorId: getMemberId() },
      });
    },
  }),
  remove: (assignmentId: number) => ({
    mutationKey: [...assignmentKeys.all, "remove", assignmentId] as const,
    mutationFn: async (): Promise<void> => {
      await instance.delete(`/assignments/${assignmentId}`, {
        params: { requestorId: getMemberId() },
      });
    },
  }),
};
