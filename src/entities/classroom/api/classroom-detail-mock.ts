import type { ClassroomDetail } from "@/entities/classroom/model/classroom-detail";

// 백엔드에 단건 조회(GET /classrooms/{id})가 없어 사용하는 격리된 목 데이터.
// 실데이터 전환 시 classroom-detail-keys.ts 의 queryFn 만 instance.get 으로 교체하면 된다.
const MOCK_CLASSROOM_DETAIL: ClassroomDetail = {
  id: 1,
  name: "알고리즘",
  classLabel: "3학년 1반",
  teacherName: "홍길동",
};

export function createMockClassroomDetail(classroomId: number): ClassroomDetail {
  return {
    ...MOCK_CLASSROOM_DETAIL,
    id: classroomId,
  };
}
