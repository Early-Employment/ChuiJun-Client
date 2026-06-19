import type { ProblemDetail, ProblemExample } from "@/entities/problem/model/problem-detail";

export function ProblemDescriptionCard({ problem }: { problem: ProblemDetail }) {
  return (
    <section className="border-line bg-surface space-y-6 rounded-t-[20px] border p-6">
      <Section title="문제 설명" body={problem.description} />
      <Section title="입력" body={problem.inputDescription} />
      <Section title="출력" body={problem.outputDescription} />

      <div className="space-y-6">
        {problem.examples.map((example, index) => (
          <ExamplePair key={index} index={index + 1} example={example} />
        ))}
      </div>
    </section>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-foreground text-xl font-semibold">{title}</h2>
      <p className="text-muted font-medium whitespace-pre-wrap">{body}</p>
    </div>
  );
}

function ExamplePair({ index, example }: { index: number; example: ProblemExample }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <ExampleBox label={`예제 입력 ${index}`} value={example.input} />
      <ExampleBox label={`예제 출력 ${index}`} value={example.output} />
    </div>
  );
}

function ExampleBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-foreground text-base font-semibold">{label}</p>
      <div className="border-line bg-surface text-muted rounded-md border px-3 py-3 font-mono text-xs whitespace-pre-wrap">
        {value}
      </div>
    </div>
  );
}
