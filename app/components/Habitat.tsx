import React from 'react';
import HabitatMap from './HabitatMap';

interface HabitatProps {
  speciesName: string;
  commonName: string;
  habitatData?: string | object;
}

const Habitat: React.FC<HabitatProps> = ({ speciesName, commonName, habitatData }) => {
  // If we have habitat data from the API, display it
  if (habitatData && habitatData !== "No habitat information available.") {
    // Handle both string and object formats
    let displayData: string;
    if (typeof habitatData === 'object') {
      // Convert object to formatted string
      displayData = Object.entries(habitatData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } else {
      displayData = habitatData;
    }

    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Habitat & Distribution</h3>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <span className="text-blue-500 mr-2">🌍</span>
            Habitat Information
          </h4>
          <p className="text-blue-800 leading-relaxed whitespace-pre-line">
            {displayData}
          </p>
        </div>
        
        {/* Habitat Map */}
        <div className="mt-6">
          <HabitatMap 
            speciesName={speciesName} 
            commonName={commonName} 
            hotspots={[]}
          />
        </div>
      </div>
    );
  }

  // Fallback to placeholder data if no API data
  const getHabitatInfo = (species: string) => {
    const habitatData: { [key: string]: any } = {
      'Lion': {
        regions: ['Sub-Saharan Africa', 'Gir Forest, India'],
        biomes: ['Savanna', 'Grasslands', 'Open Woodlands'],
        climate: 'Tropical and Subtropical',
        elevation: 'Sea level to 3,000m',
        vegetation: 'Tall grasses, scattered trees, and shrubs',
        waterSources: 'Rivers, lakes, and seasonal waterholes',
        threats: ['Habitat loss', 'Human-wildlife conflict', 'Poaching'],
        conservation: 'Vulnerable (IUCN Red List)'
      },
      'Elephant': {
        regions: ['Africa', 'Asia'],
        biomes: ['Savanna', 'Forest', 'Desert'],
        climate: 'Tropical to Subtropical',
        elevation: 'Sea level to 3,000m',
        vegetation: 'Grasslands, forests, and scrublands',
        waterSources: 'Rivers, lakes, and waterholes',
        threats: ['Habitat fragmentation', 'Poaching', 'Human conflict'],
        conservation: 'Endangered (African), Endangered (Asian)'
      },
      'Tiger': {
        regions: ['Asia'],
        biomes: ['Tropical Forest', 'Temperate Forest', 'Mangrove'],
        climate: 'Tropical to Temperate',
        elevation: 'Sea level to 4,000m',
        vegetation: 'Dense forests with water sources',
        waterSources: 'Rivers, streams, and lakes',
        threats: ['Habitat loss', 'Poaching', 'Human conflict'],
        conservation: 'Endangered (IUCN Red List)'
      }
    };

    return habitatData[species] || {
      regions: ['Various habitats worldwide'],
      biomes: ['Adaptable to multiple environments'],
      climate: 'Varies by species',
      elevation: 'Varies by species',
      vegetation: 'Diverse vegetation types',
      waterSources: 'Various water sources',
      threats: ['Habitat loss', 'Climate change', 'Human activities'],
      conservation: 'Status varies by species'
    };
  };

  const habitatInfo = getHabitatInfo(commonName);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Habitat & Distribution</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-blue-500 mr-2">🌍</span>
              Geographic Regions
            </h4>
            <div className="bg-blue-50 p-3 rounded-lg">
              <ul className="space-y-1">
                {habitatInfo.regions.map((region: string, index: number) => (
                  <li key={index} className="text-sm text-blue-800 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    {region}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-green-500 mr-2">🌲</span>
              Biomes & Ecosystems
            </h4>
            <div className="bg-green-50 p-3 rounded-lg">
              <ul className="space-y-1">
                {habitatInfo.biomes.map((biome: string, index: number) => (
                  <li key={index} className="text-sm text-green-800 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {biome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Environmental Factors */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-orange-500 mr-2">🌡️</span>
              Climate & Environment
            </h4>
            <div className="bg-orange-50 p-3 rounded-lg space-y-2">
              <div className="text-sm text-orange-800">
                <span className="font-medium">Climate:</span> {habitatInfo.climate}
              </div>
              <div className="text-sm text-orange-800">
                <span className="font-medium">Elevation:</span> {habitatInfo.elevation}
              </div>
              <div className="text-sm text-orange-800">
                <span className="font-medium">Vegetation:</span> {habitatInfo.vegetation}
              </div>
              <div className="text-sm text-orange-800">
                <span className="font-medium">Water Sources:</span> {habitatInfo.waterSources}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              Conservation Status
            </h4>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-800 mb-2">
                <span className="font-medium">Status:</span> {habitatInfo.conservation}
              </div>
              <div className="text-sm text-red-800">
                <span className="font-medium">Main Threats:</span>
                <ul className="mt-1 space-y-1">
                  {habitatInfo.threats.map((threat: string, index: number) => (
                    <li key={index} className="flex items-center ml-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                      {threat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habitat Map */}
      <div className="mt-6">
        <HabitatMap 
          speciesName={speciesName} 
          commonName={commonName} 
          hotspots={[]}
        />
      </div>
    </div>
  );
};

export default Habitat; 