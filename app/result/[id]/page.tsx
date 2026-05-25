import ResultView from "@/components/results/ResultView";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ResultView auditId={id} />;
}
