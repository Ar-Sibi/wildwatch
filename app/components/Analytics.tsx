import React, { useState, useEffect } from 'react';
import CardBody from './CardBody';

interface WildlifeEntry {
  id: string;
  timestamp: Date;
  speciesName: string;
  commonName: string;
  imageUrl?: string;
  videoUrl?: string;
  habitat: string;
  conservationStatus: string;
  type: 'image' | 'video';
}

interface SpeciesStats {
  totalIdentifications: number;
  uniqueSpecies: number;
  mostSpottedSpecies: string;
  recentActivity: number;
  favoriteHabitat: string;
  conservationImpact: number;
}

const Analytics: React.FC = () => {
  const [wildlifeEntries, setWildlifeEntries] = useState<WildlifeEntry[]>([]);
  const [stats, setStats] = useState<SpeciesStats>({
    totalIdentifications: 0,
    uniqueSpecies: 0,
    mostSpottedSpecies: '',
    recentActivity: 0,
    favoriteHabitat: '',
    conservationImpact: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    loadWildlifeData();
  }, []);

  const loadWildlifeData = () => {
    try {
      const savedEntries = localStorage.getItem('wildwatch_entries');
      if (savedEntries) {
        const entries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setWildlifeEntries(entries);
        calculateStats(entries);
      }
    } catch (error) {
      console.error('Error loading wildlife data:', error);
    }
  };

  const formatHabitat = (habitat: any): string => {
    if (typeof habitat === 'string') {
      return habitat;
    }
    
    if (typeof habitat === 'object' && habitat !== null) {
      // If it's a structured habitat object, extract the most relevant info
      if (habitat['Geographic Regions']) {
        return habitat['Geographic Regions'];
      }
      if (habitat['Biomes']) {
        return habitat['Biomes'];
      }
      // Fallback to stringifying if no clear primary field
      return JSON.stringify(habitat);
    }
    
    return String(habitat || 'Unknown habitat');
  };

  const calculateStats = (entries: WildlifeEntry[]) => {
    const totalIdentifications = entries.length;
    const uniqueSpecies = new Set(entries.map(entry => entry.speciesName)).size;
    
    // Find most spotted species
    const speciesCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      speciesCount[entry.commonName] = (speciesCount[entry.commonName] || 0) + 1;
    });
    const mostSpottedSpecies = Object.entries(speciesCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None yet';

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = entries.filter(entry => entry.timestamp > sevenDaysAgo).length;

    // Find favorite habitat - ensure habitat is always a string
    const habitatCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      const habitatString = formatHabitat(entry.habitat);
      habitatCount[habitatString] = (habitatCount[habitatString] || 0) + 1;
    });
    const favoriteHabitat = Object.entries(habitatCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Various habitats';

    // Calculate conservation impact (based on endangered species spotted)
    const endangeredSpecies = entries.filter(entry => 
      entry.conservationStatus.toLowerCase().includes('endangered') ||
      entry.conservationStatus.toLowerCase().includes('vulnerable') ||
      entry.conservationStatus.toLowerCase().includes('threatened')
    ).length;

    setStats({
      totalIdentifications,
      uniqueSpecies,
      mostSpottedSpecies,
      recentActivity,
      favoriteHabitat,
      conservationImpact: endangeredSpecies
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConservationBadge = (status: string) => {
    if (status.toLowerCase().includes('endangered')) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Endangered</span>;
    } else if (status.toLowerCase().includes('vulnerable')) {
      return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Vulnerable</span>;
    } else if (status.toLowerCase().includes('threatened')) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Threatened</span>;
    } else {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Stable</span>;
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your wildlife data? This cannot be undone.')) {
      localStorage.removeItem('wildwatch_entries');
      setWildlifeEntries([]);
      calculateStats([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wildlife Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">Track your wildlife discoveries and conservation impact</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalIdentifications}</div>
              <div className="text-gray-600">Total Identifications</div>
            </div>
          </CardBody>
          
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.uniqueSpecies}</div>
              <div className="text-gray-600">Unique Species Discovered</div>
            </div>
          </CardBody>
          
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.recentActivity}</div>
              <div className="text-gray-600">Recent Activity (7 days)</div>
            </div>
          </CardBody>
          
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.conservationImpact}</div>
              <div className="text-gray-600">Endangered Species Spotted</div>
            </div>
          </CardBody>
          
          <CardBody>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600 mb-2">{stats.mostSpottedSpecies}</div>
              <div className="text-gray-600">Most Spotted Species</div>
            </div>
          </CardBody>
          
          <CardBody>
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600 mb-2">{stats.favoriteHabitat}</div>
              <div className="text-gray-600">Favorite Habitat</div>
            </div>
          </CardBody>
        </div>

        {/* Wildlife Journal */}
        <div className="mb-8">
          <CardBody>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Personal Wildlife Journal</h2>
              {wildlifeEntries.length > 0 && (
                <button
                  onClick={clearAllData}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear All Data
                </button>
              )}
            </div>
            
            {wildlifeEntries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🦁</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Wildlife Journey</h3>
                <p className="text-gray-600 mb-6">
                  Upload images and videos to begin tracking your wildlife discoveries!
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="/"
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                  >
                    Upload Images
                  </a>
                  <a
                    href="/video-upload"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                  >
                    Upload Videos
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {wildlifeEntries
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            {entry.type === 'image' ? '📸' : '🎬'}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{entry.commonName}</h3>
                            <div className="flex items-center space-x-2">
                              {getConservationBadge(entry.conservationStatus)}
                              <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Species:</span> {entry.speciesName}
                          </p>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Habitat:</span> {formatHabitat(entry.habitat)}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Type: {entry.type === 'image' ? 'Image Upload' : 'Video Upload'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardBody>
        </div>

        {/* Species Discovery Insights */}
        {wildlifeEntries.length > 0 && (
          <div className="mb-8">
            <CardBody>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Discovery Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Species Distribution */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Species Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      wildlifeEntries.reduce((acc, entry) => {
                        acc[entry.commonName] = (acc[entry.commonName] || 0) + 1;
                        return acc;
                      }, {} as { [key: string]: number })
                    )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([species, count]) => (
                        <div key={species} className="flex items-center justify-between">
                          <span className="text-blue-800 font-medium">{species}</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {count} {count === 1 ? 'sighting' : 'sightings'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Habitat Exploration */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Habitat Exploration</h3>
                  <div className="space-y-3">
                    {Object.entries(
                      wildlifeEntries.reduce((acc, entry) => {
                        const habitatString = formatHabitat(entry.habitat);
                        acc[habitatString] = (acc[habitatString] || 0) + 1;
                        return acc;
                      }, {} as { [key: string]: number })
                    )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([habitat, count]) => (
                        <div key={habitat} className="flex items-center justify-between">
                          <span className="text-green-800 font-medium">{habitat}</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {count} {count === 1 ? 'species' : 'species'}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </div>
        )}

        {/* Conservation Impact */}
        {stats.conservationImpact > 0 && (
          <div className="mb-8">
            <CardBody>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conservation Impact</h2>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">🌍</div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">Making a Difference</h3>
                  <p className="text-purple-800 mb-4">
                    You've spotted {stats.conservationImpact} endangered or vulnerable species! 
                    Each identification helps researchers track population changes and conservation needs.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      <strong>Your impact:</strong> By documenting these species, you're contributing to 
                      citizen science and helping conservationists understand wildlife distribution patterns.
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 