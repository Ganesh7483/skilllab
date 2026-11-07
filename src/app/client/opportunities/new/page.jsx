import CreateOpportunityForm from "@/components/opportunities/CreateOpportunityForm";

export default function NewClientOpportunityPage() {
  return (
    <main className="posting-page">
      <div className="container">
        <CreateOpportunityForm accountRole="client" />
      </div>
    </main>
  );
}
