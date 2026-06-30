import { AssignmentForm } from "@/widgets/assignment-form/ui/assignment-form";

export default async function EditAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AssignmentForm mode="edit" assignmentId={id} />;
}
