export interface ClassroomMetric {
  id: "submission-rate" | "missing-students" | "accuracy-rate" | "hard-problems";
  label: string;
  value: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  avatarVariant: "neutral" | "highlight";
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  submissionLabel: string;
  isPinned: boolean;
}

export interface ClassroomDashboard {
  classLabel: string;
  metrics: ClassroomMetric[];
  students: ClassroomStudent[];
  assignments: ClassroomAssignment[];
}
