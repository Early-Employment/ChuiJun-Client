import { WrongProblemBoardBoundary } from "@/entities/problem/ui/wrong-problem-board";

export function WrongProblemTable() {
  return (
    <section>
      <h2 className="text-lg font-semibold">틀렸던 문제 확인</h2>
      <WrongProblemBoardBoundary />
    </section>
  );
}
