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
      <div className="border-line mt-2 overflow-x-auto rounded-md border">
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
