import React from 'react';

interface Hotspot {
  id?: string;
  name: string;
  region: string;
  coordinates?: { x: number; y: number };
  description: string;
  population: string;
  conservationStatus: string;
  latitude: number;
  longitude: number;
}

interface HabitatMapProps {
  speciesName: string;
  commonName: string;
  hotspots?: Array<{
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    description: string;
    population: string;
    conservationStatus: string;
  }>;
}

const HabitatMap: React.FC<HabitatMapProps> = ({ speciesName, commonName, hotspots = [] }) => {
  // Default hotspots for common animals if none provided
  const defaultHotspots: Hotspot[] = [
    {
      id: 'africa-east',
      name: 'East Africa',
      region: 'Kenya, Tanzania',
      coordinates: { x: 52, y: 35 },
      description: 'Famous for the Serengeti and Maasai Mara ecosystems',
      population: 'Large populations in protected areas',
      conservationStatus: 'Stable in protected areas',
      latitude: -1.2921,
      longitude: 36.8219
    },
    {
      id: 'africa-south',
      name: 'Southern Africa',
      region: 'South Africa, Botswana',
      coordinates: { x: 50, y: 45 },
      description: 'Kruger National Park and surrounding reserves',
      population: 'Significant populations in national parks',
      conservationStatus: 'Well-protected in reserves',
      latitude: -25.7463,
      longitude: 28.1876
    },
    {
      id: 'africa-west',
      name: 'West Africa',
      region: 'Senegal, Mali',
      coordinates: { x: 42, y: 32 },
      description: 'Sahel region and savanna ecosystems',
      population: 'Declining due to habitat loss',
      conservationStatus: 'Vulnerable',
      latitude: 14.6953,
      longitude: -17.4439
    },
    {
      id: 'india',
      name: 'India',
      region: 'Gujarat, Rajasthan',
      coordinates: { x: 75, y: 35 },
      description: 'Gir Forest National Park - only Asiatic population',
      population: 'Small but stable population',
      conservationStatus: 'Endangered',
      latitude: 22.2587,
      longitude: 71.1924
    },
    {
      id: 'central-africa',
      name: 'Central Africa',
      region: 'DR Congo, Cameroon',
      coordinates: { x: 48, y: 38 },
      description: 'Dense forests and savanna regions',
      population: 'Moderate populations in remote areas',
      conservationStatus: 'Threatened by poaching',
      latitude: -4.3369,
      longitude: 15.3271
    },
    {
      id: 'ethiopia',
      name: 'Ethiopia',
      region: 'Ethiopian Highlands',
      coordinates: { x: 55, y: 30 },
      description: 'Highland savanna and grassland ecosystems',
      population: 'Small isolated populations',
      conservationStatus: 'Critically endangered',
      latitude: 9.0084,
      longitude: 38.7575
    }
  ];

  const displayHotspots = hotspots.length > 0 ? hotspots : defaultHotspots;

  // Convert API hotspots to internal format
  const convertedHotspots: Hotspot[] = displayHotspots.map((hotspot, index) => ({
    id: `hotspot-${index}`,
    name: hotspot.name,
    region: hotspot.region,
    coordinates: { x: 0, y: 0 },
    description: hotspot.description,
    population: hotspot.population,
    conservationStatus: hotspot.conservationStatus,
    latitude: hotspot.latitude,
    longitude: hotspot.longitude
  }));

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Habitat Distribution</h3>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p className="font-medium">Species: {speciesName}</p>
          <p className="text-xs text-gray-500">Common Name: {commonName}</p>
        </div>

        <div className="grid gap-4">
          {convertedHotspots.map((hotspot, index) => (
            <div key={hotspot.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{hotspot.name}</h4>
                  <p className="text-sm text-gray-600">{hotspot.region}</p>
                  <p className="text-xs text-gray-500 mt-1">{hotspot.description}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-600">
                    <span className="font-medium">Population:</span> {hotspot.population}
                  </div>
                  <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    hotspot.conservationStatus.toLowerCase().includes('endangered') ? 'bg-red-100 text-red-800' :
                    hotspot.conservationStatus.toLowerCase().includes('vulnerable') ? 'bg-yellow-100 text-yellow-800' :
                    hotspot.conservationStatus.toLowerCase().includes('threatened') ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {hotspot.conservationStatus}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Coordinates: {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <p>Showing {convertedHotspots.length} habitat hotspots</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatMap; 