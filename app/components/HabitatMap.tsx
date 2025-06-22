import React, { useEffect, useRef } from 'react';

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
    Name: string;
    Region: string;
    Latitude: number;
    Longitude: number;
    Description: string;
    "Population Status": string;
    "Conservation Status": string;
  }>;
}

const HabitatMap: React.FC<HabitatMapProps> = ({ speciesName, commonName, hotspots = [] }) => {
  const chartRef = useRef<any>(null);
  const rootRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [mapError, setMapError] = React.useState(false);

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
  const convertedHotspots: Hotspot[] = displayHotspots.map((hotspot: any, index) => ({
    id: `hotspot-${index}`,
    name: hotspot.Name || 'Unknown Location',
    region: hotspot.Region || 'Unknown Region',
    coordinates: { x: 0, y: 0 },
    description: hotspot.Description || 'No description available',
    population: hotspot["Population Status"] || 'Unknown',
    conservationStatus: hotspot["Conservation Status"] || 'Unknown',
    latitude: hotspot.Latitude || 0,
    longitude: hotspot.Longitude || 0
  }));

  useEffect(() => {
    const initChart = async () => {
      try {
        // Wait for DOM element to be available
        const mapElement = document.getElementById("habitat-map");
        if (!mapElement) {
          console.error("Map element not found");
          return;
        }

        // Dynamic imports to avoid module resolution issues
        const am5 = await import('@amcharts/amcharts5');
        const am5map = await import('@amcharts/amcharts5/map');
        const am5geodata_worldLow = await import('@amcharts/amcharts5-geodata/worldLow');

        // Create root element
        const root = am5.Root.new("habitat-map");
        rootRef.current = root;

        // Create chart
        const chart = root.container.children.push(
          am5map.MapChart.new(root, {
            panX: "translateX",
            panY: "translateY",
            projection: am5map.geoMercator()
          })
        );
        chartRef.current = chart;

        // Create polygon series for continents
        const polygonSeries = chart.series.push(
          am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow.default,
            fill: am5.color(0xdddddd),
            stroke: am5.color(0xffffff),
            exclude: ["AQ"] // Exclude Antarctica to prevent vertical repeating
          })
        );

        // Create point series for hotspots
        const pointSeries = chart.series.push(
          am5map.MapPointSeries.new(root, {})
        );

        // Configure bullets for the point series
        pointSeries.bullets.push((root, series, dataItem) => {
          return am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, {
              radius: 4,
              fill: am5.color(0xff0000),
              stroke: am5.color(0xffffff),
              strokeWidth: 2
            })
          });
        });

        console.log('Adding hotspots:', convertedHotspots.length);

        // Add hotspots to the map
        convertedHotspots.forEach((hotspot, index) => {
          console.log(`Adding hotspot ${index}:`, hotspot.name, hotspot.longitude, hotspot.latitude);
          
          // Only add points with valid coordinates
          if (hotspot.latitude != null && hotspot.longitude != null && 
              !isNaN(hotspot.latitude) && !isNaN(hotspot.longitude)) {
            const point = pointSeries.pushDataItem({
              geometry: {
                type: "Point",
                coordinates: [hotspot.longitude, hotspot.latitude]
              }
            });

            console.log('Point created:', point);
          } else {
            console.log('Skipping hotspot with invalid coordinates:', hotspot);
          }
        });

        console.log('Total points in series:', pointSeries.dataItems.length);

        // Force chart to render
        chart.appear(1000, 100);
        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading AmCharts:', error);
        setMapError(true);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initChart, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (rootRef.current) {
        rootRef.current.dispose();
      }
    };
  }, [convertedHotspots]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Habitat Distribution Map</h3>
      
      <div className="space-y-6">
        {/* World Map */}
        <div className="relative">
          <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 p-4">
            <div id="habitat-map" className="w-full h-64 rounded-lg border border-blue-200 overflow-hidden" style={{ minHeight: '256px', maxHeight: '256px' }}>
              {!mapLoaded && !mapError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading world map...</p>
                  </div>
                </div>
              )}
              {mapError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Map could not be loaded</p>
                    <p className="text-xs text-gray-500">Showing habitat information below</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>Habitat Hotspot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Continents</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-3 text-center text-xs text-gray-500">
            <p>Hover over red dots to view habitat information • Drag to pan • Scroll to zoom</p>
          </div>
        </div>

        {/* Habitat Details */}
        <div className="grid gap-4">
          {convertedHotspots.map((hotspot, index) => (
            <div key={hotspot.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{hotspot.name || 'Unknown Location'}</h4>
                  <p className="text-sm text-gray-600">{hotspot.region || 'Unknown Region'}</p>
                  <p className="text-xs text-gray-500 mt-1">{hotspot.description || 'No description available'}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-600">
                    <span className="font-medium">Population:</span> {hotspot.population || 'Unknown'}
                  </div>
                  <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                    (hotspot.conservationStatus || '').toLowerCase().includes('endangered') ? 'bg-red-100 text-red-800' :
                    (hotspot.conservationStatus || '').toLowerCase().includes('vulnerable') ? 'bg-yellow-100 text-yellow-800' :
                    (hotspot.conservationStatus || '').toLowerCase().includes('threatened') ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {hotspot.conservationStatus || 'Unknown'}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Coordinates: {(hotspot.latitude || 0).toFixed(4)}, {(hotspot.longitude || 0).toFixed(4)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500">
            <p>Showing {convertedHotspots.length} habitat hotspots on world map</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitatMap; 