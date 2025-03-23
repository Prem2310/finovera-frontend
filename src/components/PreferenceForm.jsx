import { useForm, Controller } from "react-hook-form";
import FormInput from "./FormInput";
import Button from "./Button";
import { useSetUserPrefMutation } from "../hooks/mutations/useSetUserPrefMutation";

const PreferenceForm = () => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      portfolio_name: "",
      primary_goal: "",
      investment_horizon: "",
      risk_tolerance: "Medium",
      investment_exp_years: "",
      income: "",
      percent_income_to_invest: 50,
      preferable_sector: [],
    },
  });

  const { mutate: setPreferenceMutate, isLoading } = useSetUserPrefMutation();

  // Watch values for UI updates
  const watchRiskTolerance = watch("riskTolerance");
  const watchSectors = watch("sectors");
  const watchStockPercentage = watch("stockPercentage");

  const onSubmit = (data) => {
    const newData = {
      portfolio_name: data.nameOfPortfolio,
      primary_goal: data.investmentGoal,
      investment_horizon: data.investmentHorizon,
      risk_tolerance: data.riskTolerance,
      investment_exp_years: Number(data.yearsExperience),
      income: Number(data.monthlyIncome),
      percent_income_to_invest: data.stockPercentage,
      preferable_sector: data.sectors,
      access_token: localStorage.getItem("access_token"),
    };
    setPreferenceMutate(newData);
    console.log("Form submitted:", data);
    // Handle form submission logic here
  };

  const handleRiskToleranceChange = (value) => {
    setValue("riskTolerance", value);
  };

  const handleSectorChange = (sector) => {
    const currentSectors = watchSectors || [];
    const updatedSectors = currentSectors.includes(sector)
      ? currentSectors.filter((s) => s !== sector)
      : [...currentSectors, sector];

    setValue("sectors", updatedSectors);
  };

  const investmentGoalOptions = [
    { value: "", label: "Select your goal" },
    { value: "Growth", label: "Long term growth" },
    { value: "Income", label: "More income" },
    { value: "Preservation", label: "Preservation for other goals" },
  ];

  const investmentHorizonOptions = [
    { value: "", label: "Select your horizon" },
    { value: "short", label: "Short-term (<1 year)" },
    { value: "medium", label: "Medium-term (1–5 years)" },
    { value: "long", label: "Long-term (>5 years)" },
  ];

  const sectors = [
    "Real Estate",
    "Finance",
    "Technology",
    "Healthcare",
    "Energy",
    "Consumer Goods",
    "Automotive",
    "Utilities",
    "Agriculture",
    "Telecom",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Investment Profile
        </h1>
        <p className="text-gray-900">
          Customize your investment strategy with AI-driven recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="nameOfPortfolio"
          control={control}
          render={({ field }) => (
            <FormInput
              label="Enter your portfolio name"
              type="text"
              placeholder="Enter portfolio name"
              className="bg-gray-50 border-gray-200 focus:ring-slate-900"
              {...field}
            />
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="investmentGoal"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Primary Investment Goal"
                type="select"
                options={investmentGoalOptions}
                className="bg-gray-50 border-gray-200 focus:ring-slate-900"
                {...field}
              />
            )}
          />

          <Controller
            name="investmentHorizon"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Investment Horizon"
                type="select"
                options={investmentHorizonOptions}
                className="bg-gray-50 border-gray-200 focus:ring-slate-900"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Risk Tolerance
          </label>
          <div className="flex space-x-4">
            {["Low", "Medium", "High"].map((risk) => (
              <Button
                key={risk}
                type="button"
                onClick={() => handleRiskToleranceChange(risk)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  watchRiskTolerance === risk
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {risk}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="yearsExperience"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Years of Investment Experience"
                type="number"
                min="0"
                placeholder="Enter years"
                className="bg-gray-50 border-gray-200 focus:ring-slate-900"
                {...field}
              />
            )}
          />

          <Controller
            name="monthlyIncome"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Monthly Income ($)"
                type="number"
                min="0"
                placeholder="Enter amount"
                prefix={<span className="text-gray-900">$</span>}
                className="bg-gray-50 border-gray-200 focus:ring-slate-900"
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name="stockPercentage"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Percentage of Income to Invest in Stocks: {field.value}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                {...field}
              />
              <div className="flex justify-between text-xs text-gray-900 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        />

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Interested Asset Sectors
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {sectors.map((sector) => (
              <div
                key={sector}
                onClick={() => handleSectorChange(sector)}
                className={`
                  px-3 py-2 rounded-lg border text-sm font-medium text-center cursor-pointer transition-all
                  ${
                    watchSectors && watchSectors.includes(sector)
                      ? "bg-slate-50 border-slate-900 text-slate-900"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {sector}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="primary"
            btnType="submit"
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Set Investment preference
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PreferenceForm;
