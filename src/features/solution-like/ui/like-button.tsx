"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { solutionKeys } from "@/entities/solution/api/solution-keys";
import type { SolutionDetail } from "@/entities/solution/model/solution";
import { HeartIcon } from "@/shared/assets/HeartIcon";

interface Props {
  solutionId: number;
  liked: boolean;
}

export function LikeButton({ solutionId, liked }: Props) {
  const queryClient = useQueryClient();
  const detailKey = solutionKeys.detail(solutionId).queryKey;

  const like = useMutation({
    ...solutionKeys.like(solutionId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: detailKey });
      const previous = queryClient.getQueryData<SolutionDetail>(detailKey);
      if (previous) {
        queryClient.setQueryData<SolutionDetail>(detailKey, {
          ...previous,
          liked: !previous.liked,
          likes: previous.liked ? previous.likes - 1 : previous.likes + 1,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(detailKey, context.previous);
      }
    },
    onSettled: () => {
      // 목록(SolutionBoard)도 좋아요 수를 표시하므로 상세·목록을 함께 갱신한다.
      queryClient.invalidateQueries({ queryKey: solutionKeys.all });
    },
  });

  return (
    <button
      type="button"
      onClick={() => like.mutate()}
      aria-pressed={liked}
      className="bg-accent text-neutral-0 flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium"
    >
      <HeartIcon filled={liked} className="size-4" />
      좋아요
    </button>
  );
}
