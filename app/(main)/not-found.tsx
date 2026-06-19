import { FullPageErrorScreen } from "@/shared/ui/full-page-error-screen";

export default function MainNotFoundPage() {
  return (
    <FullPageErrorScreen
      eyebrow="404 Not Found"
      title="페이지를 찾을 수 없어요"
      description="주소가 잘못되었거나 이미 이동된 페이지입니다. 홈으로 돌아가 다시 탐색해주세요."
      primaryAction={{ href: "/", label: "홈으로 돌아가기" }}
      fillViewport={false}
    />
  );
}
