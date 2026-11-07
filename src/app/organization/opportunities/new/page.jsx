import CreateOpportunityForm from "@/components/opportunities/CreateOpportunityForm";

export default function NewOrganizationOpportunityPage() {
  return (
    <main className="posting-page">
      <div className="container">
        <CreateOpportunityForm accountRole="organization" />
      </div>
    </main>
  );
}
