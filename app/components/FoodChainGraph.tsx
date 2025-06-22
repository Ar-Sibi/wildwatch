import React, { useState } from 'react';

interface FoodChainGraphProps {
  foodChain: string;
  showLabels?: boolean;
  showArrows?: boolean;
  compactMode?: boolean;
}

const FoodChainGraph: React.FC<FoodChainGraphProps> = ({ 
  foodChain, 
  showLabels = true, 
  showArrows = true, 
  compactMode = false 
}) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Parse the food chain string (format: "producer -> herbivore -> carnivore -> apex predator")
  const parseFoodChain = (chain: string) => {
    if (!chain || chain === "No food chain information available.") {
      return [];
    }
    return chain.split('->').map(item => item.trim());
  };

  const foodChainItems = parseFoodChain(foodChain);

  // Get role labels for each position
  const getRoleLabel = (index: number, total: number) => {
    if (index === 0) return 'Producer';
    if (index === total - 1) return 'Decomposer';
    if (index === 1) return 'Primary Consumer';
    if (index === 2) return 'Secondary Consumer';
    if (index === 3) return 'Tertiary Consumer';
    if (index === 4) return 'Apex Predator';
    return 'Consumer';
  };

  // Get text size class based on text length
  const getTextSizeClass = (text: string, compactMode: boolean) => {
    if (compactMode) {
      if (text.length <= 4) return 'text-sm';
      if (text.length <= 6) return 'text-xs';
      if (text.length <= 8) return 'text-[10px]';
      return 'text-[8px]';
    }
    if (text.length <= 6) return 'text-lg';
    if (text.length <= 8) return 'text-base';
    if (text.length <= 10) return 'text-sm';
    if (text.length <= 12) return 'text-xs';
    return 'text-[10px]';
  };

  // Get color for each level
  const getLevelColor = (index: number, total: number) => {
    const colors = [
      'bg-green-200 text-green-800', // Producer
      'bg-blue-200 text-blue-800',   // Primary Consumer
      'bg-yellow-200 text-yellow-800', // Secondary Consumer
      'bg-orange-200 text-orange-800',  // Tertiary Consumer
      'bg-red-200 text-red-800',  // Apex Predator
      'bg-gray-200 text-gray-800'    // Decomposer
    ];
    return colors[Math.min(index, colors.length - 1)];
  };

  // If no food chain data, show a message
  if (foodChainItems.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Chain</h3>
        <div className="text-center text-gray-500">
          <p>No food chain information available for this wildlife.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Food Chain Ecosystem</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedItem(null)}
            className={`px-3 py-1 text-xs rounded ${
              selectedItem === null 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Levels
          </button>
        </div>
      </div>
      
      {/* Main Food Chain Display */}
      <div className={`flex items-center justify-center ${compactMode ? 'space-x-3' : 'space-x-6'} mb-6 flex-wrap`}>
        {foodChainItems.map((item, index) => (
          <React.Fragment key={index}>
            <div 
              className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                selectedItem === null || selectedItem === index ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
              }`}
              onClick={() => setSelectedItem(selectedItem === index ? null : index)}
            >
              <div className={`
                ${compactMode ? 'w-20 h-20' : 'w-28 h-28'} 
                ${getLevelColor(index, foodChainItems.length)}
                rounded-full flex items-center justify-center font-semibold 
                ${getTextSizeClass(item, compactMode)} text-center shadow-md hover:shadow-lg transition-all duration-200
                border-2 border-white hover:border-gray-300
              `}>
                {item}
              </div>
              {showLabels && (
                <span className={`text-xs text-gray-600 mt-2 text-center ${compactMode ? 'max-w-14' : 'max-w-20'} font-medium`}>
                  {getRoleLabel(index, foodChainItems.length)}
                </span>
              )}
            </div>
            
            {index < foodChainItems.length - 1 && showArrows && (
              <div className="flex flex-col items-center">
                <div className={`
                  ${compactMode ? 'w-10 h-10' : 'w-16 h-16'} 
                  bg-red-100 border-2 border-red-300 rounded-full flex items-center justify-center shadow-sm
                `}>
                  <span className="text-red-600 text-lg font-bold">→</span>
                </div>
                {showLabels && (
                  <span className="text-xs text-gray-500 mt-1 font-medium">consumed by</span>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Selected Item Details */}
      {selectedItem !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 shadow-sm">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <div className={`w-6 h-6 rounded-full ${getLevelColor(selectedItem, foodChainItems.length)} flex items-center justify-center text-xs font-bold mr-2`}>
              {foodChainItems[selectedItem].charAt(0)}
            </div>
            {foodChainItems[selectedItem]} - {getRoleLabel(selectedItem, foodChainItems.length)}
          </h4>
          <p className="text-sm text-blue-800">
            Position {selectedItem + 1} in the food chain ecosystem
          </p>
        </div>
      )}
      
      {/* Raw Food Chain Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 font-medium">
          <span className="text-gray-500">Complete Food Chain:</span> {foodChain}
        </p>
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
          Click on any organism to highlight its position in the ecosystem
        </p>
      </div>
    </div>
  );
};

export default FoodChainGraph; 