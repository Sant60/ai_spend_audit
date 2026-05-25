import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { AuditRecommendation } from "@/types/audit";

const RecommendationCard = ({
  recommendation,
}: {
  recommendation: AuditRecommendation;
}) => {
  return (
    <div className="border border-black bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#112a5c]">
            Recommendation
          </p>
          <h3 className="text-xl font-bold text-black">
            {recommendation.toolName} {recommendation.planName}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-black">Estimated cost</p>
          <p className="text-xl font-bold text-black">
            {formatCurrency(recommendation.monthlyCost)}
          </p>
        </div>
      </div>

      <p className="text-sm leading-6 text-black">
        {recommendation.reason}
      </p>
    </div>
  );
};

export default RecommendationCard;
