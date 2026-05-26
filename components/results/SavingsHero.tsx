import { formatCurrency } from "@/lib/utils/formatCurrency";

interface SavingsHeroProps {
  currentSpend: number;
  monthlySavings: number;
  annualSavings: number;
  overspend: boolean;
}

const SavingsHero = ({
  currentSpend,
  monthlySavings,
  annualSavings,
  overspend,
}: SavingsHeroProps) => {
  return (
    <section className=" bg-white p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-black sm:text-4xl text-center">
        Your report
      </h1>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <span className="inline-flex bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#112a5c]">
            {overspend ? "Savings found" : "Looks fine"}
          </span>
          <div className="space-y-2"></div>
        </div>

        {/* <div className=" bg-[#112a5c] px-5 py-4 text-left text-white sm:text-right">
          <p className="text-sm font-bold uppercase tracking-wide">
            Annual savings
          </p>
          <p className="text-3xl font-bold">{formatCurrency(annualSavings)}</p>
        </div> */}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="shadow inset-shadow-sm inset-shadow-black rounded-[5]  bg-white p-5">
          <p className="text-sm text-black">Current monthly spend</p>
          <p className="mt-2 text-2xl font-bold text-black">
            {formatCurrency(currentSpend)}
          </p>
        </div>
        <div className="shadow inset-shadow-sm inset-shadow-black rounded-[5] bg-white p-5">
          <p className="text-sm text-black">Estimated monthly savings</p>
          <p className="mt-2 text-2xl font-bold text-black">
            {formatCurrency(monthlySavings)}
          </p>
        </div>
        <div className="shadow inset-shadow-sm inset-shadow-black rounded-[5] bg-white p-5 ">
          <p className="text-sm text-black">Estimated annual savings</p>
          <p className="mt-2 text-2xl font-bold text-black">
            {formatCurrency(annualSavings)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SavingsHero;
