import type {
  SolutionDetail,
  SolutionPage,
  SolutionSummary,
} from "@/entities/solution/model/solution";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 solution-keys.ts 의 queryFn/mutationFn 만 instance 호출로 교체하면 이 파일은 제거 대상이다.

const PAGE_SIZE = 15;

const BASE_ROWS: Omit<SolutionSummary, "id">[] = [
  ...Array.from({ length: 6 }, () => ({
    author: "박서현",
    language: "C",
    solveTime: "00:02:55",
    views: 3,
    comments: 2,
    likes: 1,
  })),
  { author: "한지민", language: "Swift", solveTime: "00:02:40", views: 4, comments: 2, likes: 6 },
  { author: "박지훈", language: "PHP", solveTime: "00:04:25", views: 3, comments: 2, likes: 1 },
  { author: "김하늘", language: "C#", solveTime: "00:03:15", views: 2, comments: 3, likes: 2 },
  { author: "차민규", language: "Kotlin", solveTime: "00:06:00", views: 10, comments: 7, likes: 8 },
  ...Array.from({ length: 4 }, () => ({
    author: "박서현",
    language: "C",
    solveTime: "00:02:55",
    views: 3,
    comments: 2,
    likes: 1,
  })),
];

const TOTAL_PAGES = 5;

export function createMockSolutionPage(_problemId: number, page: number): SolutionPage {
  const items: SolutionSummary[] = BASE_ROWS.map((row, index) => ({
    id: (page - 1) * PAGE_SIZE + index + 1,
    ...row,
  }));
  return { items, page, totalPages: TOTAL_PAGES };
}

const MOCK_CODE = `printf( " help " ) ;
`;

// 좋아요 토글 상태를 세션 동안 유지하기 위한 인메모리 저장소.
const likeState = new Map<number, { likes: number; liked: boolean }>();

export function createMockSolutionDetail(solutionId: number): SolutionDetail {
  const state = likeState.get(solutionId) ?? { likes: 16, liked: false };
  likeState.set(solutionId, state);
  return {
    id: solutionId,
    author: "유은서",
    authorId: 3106,
    createdAt: "2026.05.08 16:12",
    language: "C",
    code: MOCK_CODE,
    likes: state.likes,
    liked: state.liked,
    comments: 2,
  };
}

export function toggleMockSolutionLike(solutionId: number): { likes: number; liked: boolean } {
  const state = likeState.get(solutionId) ?? { likes: 16, liked: false };
  const next = state.liked
    ? { likes: state.likes - 1, liked: false }
    : { likes: state.likes + 1, liked: true };
  likeState.set(solutionId, next);
  return next;
}
