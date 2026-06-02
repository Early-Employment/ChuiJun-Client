const wrongProblems = [
  {
    id: 1,
    title: "두 수의 합",
    attempts: 2,
    date: "2026.04.03",
    reason: "Runtime Error",
  },
  {
    id: 2,
    title: "DFS와 BFS",
    attempts: 3,
    date: "2026.04.04",
    reason: "Wrong Answer",
  },
];

export function WrongProblemTable() {
  return (
    <section>
      <h2 className="text-lg font-semibold">틀렸던 문제 확인</h2>

      <ul className="border-line divide-line bg-surface mt-2 divide-y rounded-md border md:hidden">
        {wrongProblems.map((problem, index) => (
          <li key={`${problem.title}-${index}`} className="space-y-3 px-4 py-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold">{problem.title}</span>
              <span className="text-muted shrink-0">#{problem.id}</span>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div className="space-y-1">
                <dt className="text-muted">시도 횟수</dt>
                <dd>{problem.attempts}회</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted">시도 날짜</dt>
                <dd>{problem.date}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted">실패 이유</dt>
                <dd>{problem.reason}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="border-line mt-2 hidden overflow-x-auto rounded-md border md:block">
        <table className="bg-surface w-full min-w-[720px] border-collapse text-center text-sm">
          <thead className="bg-neutral-200 font-medium">
            <tr>
              <th className="px-6 py-3 font-medium">순번</th>
              <th className="px-6 py-3 font-medium">문제명</th>
              <th className="px-6 py-3 font-medium">시도한 횟수</th>
              <th className="px-6 py-3 font-medium">시도한 날짜</th>
              <th className="px-6 py-3 font-medium">실패 이유</th>
            </tr>
          </thead>
          <tbody>
            {wrongProblems.map((problem, index) => (
              <tr key={`${problem.title}-${index}`} className="border-line border-t">
                <td className="px-6 py-3">{problem.id}</td>
                <td className="px-6 py-3">{problem.title}</td>
                <td className="px-6 py-3">{problem.attempts}</td>
                <td className="px-6 py-3">{problem.date}</td>
                <td className="px-6 py-3">{problem.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
