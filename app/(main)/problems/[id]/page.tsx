import { ProblemSolveViewBoundary } from "@/widgets/problem-solve/ui/problem-solve-view";

export default async function ProblemSolvePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProblemSolveViewBoundary id={Number(id)} />;
}
