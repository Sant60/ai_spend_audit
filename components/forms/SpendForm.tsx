import RecommendationCard from "@/components/results/RecommendationCard";

const SpendForm = () => {
  const savings = 40;
  return (
    <>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="AI Tool Name"
          className="border p-2 rounded"
        />

        <select className="border p-2 rounded">
          <option>Choose Plan</option>
          <option>Plus</option>
          <option>Team</option>
          <option>Enterprise</option>
        </select>

        <input
          type="number"
          placeholder="Monthly Spend"
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Team Size"
          className="border p-2 rounded"
        />

        <select className="border p-2 rounded">
          <option>Primary Use Case</option>
          <option>Coding</option>
          <option>Writing</option>
          <option>Research</option>
        </select>

        <button className="bg-blue-600 text-white p-3 rounded">
          Generate Audit
        </button>
      </form>
      <div>
        <RecommendationCard savings={savings} />
      </div>
    </>
  );
};

export default SpendForm;
