import { useState } from "react";
import FormInput from "./FormInput";

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    investmentGoal: "",
    investmentHorizon: "",
    riskTolerance: "Medium",
    yearsExperience: "",
    monthlyIncome: "",
    stockPercentage: 50,
    sectors: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRiskToleranceChange = (value) => {
    setFormData({
      ...formData,
      riskTolerance: value,
    });
  };

  const handleSectorChange = (sector) => {
    const updatedSectors = formData.sectors.includes(sector)
      ? formData.sectors.filter((s) => s !== sector)
      : [...formData.sectors, sector];

    setFormData({
      ...formData,
      sectors: updatedSectors,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const investmentGoalOptions = [
    { value: "", label: "Select your goal" },
    { value: "retirement", label: "Retirement" },
    { value: "house", label: "Buying a House" },
    { value: "wealth", label: "Wealth Growth" },
    { value: "education", label: "Education" },
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
        <p className="text-gray-600">
          Customize your investment strategy with AI-driven recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="investmentGoal"
            label="Primary Investment Goal"
            type="select"
            options={investmentGoalOptions}
            value={formData.investmentGoal}
            onChange={handleInputChange}
            className="bg-gray-50 border-gray-200 focus:ring-blue-500"
          />

          <FormInput
            name="investmentHorizon"
            label="Investment Horizon"
            type="select"
            options={investmentHorizonOptions}
            value={formData.investmentHorizon}
            onChange={handleInputChange}
            className="bg-gray-50 border-gray-200 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Risk Tolerance
          </label>
          <div className="flex space-x-4">
            {["Low", "Medium", "High"].map((risk) => (
              <button
                key={risk}
                type="button"
                onClick={() => handleRiskToleranceChange(risk)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.riskTolerance === risk
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            name="yearsExperience"
            label="Years of Investment Experience"
            type="number"
            min="0"
            placeholder="Enter years"
            value={formData.yearsExperience}
            onChange={handleInputChange}
            className="bg-gray-50 border-gray-200 focus:ring-blue-500"
          />

          <FormInput
            name="monthlyIncome"
            label="Monthly Income ($)"
            type="number"
            min="0"
            placeholder="Enter amount"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            prefix={<span className="text-gray-500">$</span>}
            className="bg-gray-50 border-gray-200 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Percentage of Income to Invest in Stocks: {formData.stockPercentage}
            %
          </label>
          <input
            type="range"
            name="stockPercentage"
            min="0"
            max="100"
            value={formData.stockPercentage}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

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
                    formData.sectors.includes(sector)
                      ? "bg-blue-50 border-blue-300 text-blue-700"
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
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Generate Investment Recommendations
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
