import { notFound } from "next/navigation";
import { ProblemSolveViewBoundary } from "@/widgets/problem-solve/ui/problem-solve-view";

export default async function ProblemSolvePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problemId = Number(id);

  if (isNaN(problemId)) {
    notFound();
  }

  return <ProblemSolveViewBoundary id={problemId} />;
}
