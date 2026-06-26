import type { ProblemListItem } from "@/entities/problem/model/problem-list-item";

export interface ProblemListPage {
  items: ProblemListItem[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}
