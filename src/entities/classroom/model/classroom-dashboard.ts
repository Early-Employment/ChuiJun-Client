export interface ClassroomMetric {
  id: "submission-rate" | "missing-students" | "accuracy-rate" | "hard-problems";
  label: string;
  value: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  profileImageUrl: string | null;
}

export interface ClassroomDashboard {
  metrics: ClassroomMetric[];
  students: ClassroomStudent[];
}
