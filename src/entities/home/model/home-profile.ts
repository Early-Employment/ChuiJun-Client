export interface HomeProfileStat {
  label: string;
  value: string;
}

export interface HomeProfile {
  displayName: string;
  stats: HomeProfileStat[];
}
