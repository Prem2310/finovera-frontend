
import React from "react";
import {
  HiTrendingDown,
  HiTrendingUp,
  HiExclamationCircle,
  HiChartPie,
  HiCurrencyRupee,
  HiArrowRight,
  HiX,
  HiLightBulb,
  HiCheckCircle,
} from "react-icons/hi";
import { HiArrowsRightLeft, HiMiniChartBar } from "react-icons/hi2";

const PortfolioInsights = ({ insightsData, onClose }) => {
  // Extract summarize_llm from the nested JSON structure, with fallback
  console.log(insightsData.message)
  const data = insightsData?.message || {
};

  // Format currency values with fallback for NaN
  const formatCurrency = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue) || value === null || value === undefined) {
      return "₹0.00";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(numValue);
  };

  // Enhanced markdown parser
  const parseMarkdown = (text) => {
    if (!text) return [];
    
    // Split by ## to get main sections
    const sections = text.split('##').filter(section => section.trim());
    
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      return {
        title,
        content,
        type: getContentType(content)
      };
    });
  };

  const getContentType = (content) => {
    if (content.includes('*') && content.includes('**')) {
      return 'mixed'; // Contains both bullets and bold text
    } else if (content.includes('*')) {
      return 'bullets';
    } else {
      return 'text';
    }
  };

  // Parse bullet points with nested structure
  const parseBulletPoints = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const items = [];
    let currentItem = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('  *')) {
        // Main bullet point
        if (currentItem) {
          items.push(currentItem);
        }
        
        const text = trimmedLine.substring(1).trim();
        const boldMatch = text.match(/\*\*(.*?)\*\*/);
        
        currentItem = {
          title: boldMatch ? boldMatch[1] : text.split(':')[0],
          content: boldMatch ? text.replace(/\*\*(.*?)\*\*/, '').replace(':', '').trim() : text.split(':').slice(1).join(':').trim(),
          subItems: []
        };
      } else if (trimmedLine.startsWith('*') && trimmedLine.startsWith('  *')) {
        // Sub bullet point
        if (currentItem) {
          const subText = trimmedLine.substring(3).trim();
          const boldMatch = subText.match(/\*\*(.*?)\*\*/);
          
          currentItem.subItems.push({
            title: boldMatch ? boldMatch[1] : subText.split(':')[0],
            content: boldMatch ? subText.replace(/\*\*(.*?)\*\*/, '').replace(':', '').trim() : subText.split(':').slice(1).join(':').trim()
          });
        }
      } else if (currentItem && trimmedLine && !trimmedLine.startsWith('*')) {
        // Continuation of previous item
        currentItem.content += ' ' + trimmedLine;
      }
    });
    
    if (currentItem) {
      items.push(currentItem);
    }
    
    return items;
  };

  const sections = parseMarkdown(data.insights_and_recommendations);

  const renderContent = (section) => {
    if (section.type === 'bullets' || section.type === 'mixed') {
      const bulletPoints = parseBulletPoints(section.content);
      
      return (
        <div className="space-y-4">
          {bulletPoints.map((item, index) => (
            <div key={index} className="border-l-2 border-blue-100 pl-4 py-2">
              <div className="flex items-start">
                <HiCheckCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                  {item.content && (
                    <p className="text-gray-600 text-sm mb-2">{item.content}</p>
                  )}
                  {item.subItems.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <div key={subIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-700">{subItem.title}:</span>
                            <span className="text-gray-600 ml-1">{subItem.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return <p className="text-gray-600 leading-relaxed">{section.content}</p>;
    }
  };

  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('summary')) return <HiMiniChartBar className="w-5 h-5" />;
    if (lowerTitle.includes('insight')) return <HiLightBulb className="w-5 h-5" />;
    if (lowerTitle.includes('recommendation')) return <HiArrowRight className="w-5 h-5" />;
    return <HiArrowsRightLeft className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <HiChartPie className="mr-3 text-blue-600" />
              Portfolio Analysis & Insights
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <HiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Key Metrics Cards */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500 mb-2 font-medium">Total Invested</div>
                <div className="text-2xl font-bold flex items-center text-gray-800">
                  <HiCurrencyRupee className="text-gray-400 w-6 h-6" />
                  {formatCurrency(data.total_invested_value).replace("₹", "")}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500 mb-2 font-medium">Current Value</div>
                <div className="text-2xl font-bold flex items-center text-gray-800">
                  <HiCurrencyRupee className="text-gray-400 w-6 h-6" />
                  {formatCurrency(data.current_value).replace("₹", "")}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500 mb-2 font-medium">Total P&L</div>
                <div
                  className={`text-2xl font-bold flex items-center ${
                    data.total_profit_loss < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {data.total_profit_loss < 0 ? (
                    <HiTrendingDown className="mr-2 w-6 h-6" />
                  ) : (
                    <HiTrendingUp className="mr-2 w-6 h-6" />
                  )}
                  {formatCurrency(Math.abs(data.total_profit_loss))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-500 mb-2 font-medium">P&L Percentage</div>
                <div
                  className={`text-2xl font-bold flex items-center ${
                    data.total_pnl_percentage < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {data.total_pnl_percentage < 0 ? (
                    <HiTrendingDown className="mr-2 w-6 h-6" />
                  ) : (
                    <HiTrendingUp className="mr-2 w-6 h-6" />
                  )}
                  {Math.abs(data.total_pnl_percentage).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="px-6 pb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <HiExclamationCircle className="h-6 w-6 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">
                    Portfolio Alert
                  </h3>
                  <p className="text-sm text-amber-700">
                    Your portfolio requires immediate attention. There's a significant loss of{" "}
                    <span className="font-semibold">
                      {Math.abs(data.total_pnl_percentage).toFixed(2)}%
                    </span>{" "}
                    on your investments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="px-6 pb-6 space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center text-blue-600">
                    {getSectionIcon(section.title)}
                    <span className="ml-2">{section.title}</span>
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(section)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>Analysis generated based on current portfolio performance</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInsights;
