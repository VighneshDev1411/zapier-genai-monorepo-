import FlowBuilder from "@/components/FlowBuilder";

export default function NewFlowPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Create New Flow</h1>
      <FlowBuilder />
    </main>
  );
}
