import React from 'react';

interface BehaviorProps {
  speciesName: string;
  commonName: string;
  behaviorAnalysis?: string;
  moodAnalysis?: string;
}

const Behavior: React.FC<BehaviorProps> = ({ 
  speciesName, 
  commonName, 
  behaviorAnalysis,
  moodAnalysis
}) => {
  // Helper function to convert object to string if needed
  const formatText = (data: any): string => {
    if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      // Convert object to formatted string
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n\n');
    }
    return '';
  };

  // Format the behavior and mood analysis
  const formattedBehaviorAnalysis = formatText(behaviorAnalysis);
  const formattedMoodAnalysis = formatText(moodAnalysis);

  // If we have behavior data from the API, display it
  if (formattedBehaviorAnalysis && formattedBehaviorAnalysis !== "No behavior analysis available.") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavior & Mood Analysis</h3>
        
        <div className="space-y-6">
          {/* Behavior Analysis */}
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
              <span className="text-orange-500 mr-2">🎬</span>
              Video Behavior Analysis
            </h4>
            <div className="text-orange-800 leading-relaxed whitespace-pre-line">
              {formattedBehaviorAnalysis}
            </div>
          </div>

          {/* Mood Analysis */}
          {formattedMoodAnalysis && formattedMoodAnalysis !== "No mood analysis available." && (
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-900 mb-3 flex items-center">
                <span className="text-pink-500 mr-2">😊</span>
                Emotional State & Mood Analysis
              </h4>
              <div className="text-pink-800 leading-relaxed whitespace-pre-line">
                {formattedMoodAnalysis}
              </div>
            </div>
          )}

          {/* Mood Indicators */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
            <h4 className="font-semibold text-pink-900 mb-4 flex items-center">
              <span className="text-pink-500 mr-2">🔍</span>
              Mood Indicators
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Positive Mood Indicators */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-3 flex items-center">
                  <span className="text-green-500 mr-2">😊</span>
                  Positive Mood Signs
                </h5>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Relaxed body posture</li>
                  <li>• Playful behavior</li>
                  <li>• Content vocalizations</li>
                  <li>• Social interactions</li>
                  <li>• Comfortable grooming</li>
                  <li>• Alert but calm demeanor</li>
                </ul>
              </div>

              {/* Negative Mood Indicators */}
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h5 className="font-medium text-red-800 mb-3 flex items-center">
                  <span className="text-red-500 mr-2">😰</span>
                  Stress/Agitation Signs
                </h5>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Tense body posture</li>
                  <li>• Aggressive displays</li>
                  <li>• Fearful behavior</li>
                  <li>• Avoidance responses</li>
                  <li>• Excessive vocalizations</li>
                  <li>• Defensive posturing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Behavior Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movement Patterns */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="text-blue-500 mr-2">🏃</span>
                Movement Patterns
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Walking and running gaits</li>
                <li>• Swimming and diving techniques</li>
                <li>• Flying and gliding patterns</li>
                <li>• Climbing and jumping abilities</li>
                <li>• Territorial patrolling</li>
                <li>• Migration behaviors</li>
              </ul>
            </div>

            {/* Social Interactions */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                <span className="text-green-500 mr-2">👥</span>
                Social Interactions
              </h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Group dynamics and hierarchy</li>
                <li>• Mating rituals and courtship</li>
                <li>• Parental care and nurturing</li>
                <li>• Communication signals</li>
                <li>• Play behavior</li>
                <li>• Aggression and dominance</li>
              </ul>
            </div>

            {/* Feeding Behavior */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="text-purple-500 mr-2">🍽️</span>
                Feeding Behavior
              </h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• Hunting techniques and strategies</li>
                <li>• Foraging patterns</li>
                <li>• Food storage and caching</li>
                <li>• Cooperative hunting</li>
                <li>• Feeding hierarchy</li>
                <li>• Dietary preferences</li>
              </ul>
            </div>

            {/* Communication */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                <span className="text-yellow-500 mr-2">🗣️</span>
                Communication
              </h4>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li>• Vocalizations and calls</li>
                <li>• Body language and gestures</li>
                <li>• Scent marking and pheromones</li>
                <li>• Visual displays</li>
                <li>• Warning signals</li>
                <li>• Courtship displays</li>
              </ul>
            </div>
          </div>

          {/* Behavioral Insights */}
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
              <span className="text-indigo-500 mr-2">🧠</span>
              Behavioral Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
              <div>
                <h5 className="font-medium mb-2">Cognitive Abilities</h5>
                <p>Problem-solving, tool use, memory, learning patterns, and social intelligence</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Environmental Adaptation</h5>
                <p>How the animal adapts to seasonal changes, weather conditions, and habitat modifications</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Conservation Behavior</h5>
                <p>Behaviors that help the species survive and adapt to changing environments</p>
              </div>
            </div>
          </div>

          {/* Research Applications */}
          <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-teal-900 mb-3 flex items-center">
              <span className="text-teal-500 mr-2">🔬</span>
              Research Applications
            </h4>
            <div className="text-sm text-teal-800 space-y-2">
              <p>Understanding animal behavior through video analysis helps researchers:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Study population dynamics and social structures</li>
                <li>Monitor health and stress levels in wild populations</li>
                <li>Develop better conservation strategies</li>
                <li>Understand species interactions and ecosystem roles</li>
                <li>Track behavioral changes due to environmental factors</li>
                <li>Improve captive breeding and reintroduction programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to placeholder data if no API data
  const getBehaviorInfo = (species: string) => {
    const behaviorData: { [key: string]: any } = {
      'Lion': {
        analysis: "Lions exhibit complex social behaviors within prides. They show cooperative hunting strategies, territorial marking through scent and vocalizations, and strong maternal bonds. Dominant males patrol territories while females coordinate hunting efforts. Cubs learn hunting skills through play and observation.",
        mood: "Lions typically display confident and relaxed moods when in their natural habitat. Content lions show relaxed body posture, gentle vocalizations, and comfortable social interactions within their pride.",
        patterns: "Movement patterns include stalking prey, territorial patrolling, and pride coordination during hunts."
      },
      'Elephant': {
        analysis: "Elephants display highly social behavior with strong family bonds. They show complex communication through vocalizations, body language, and seismic signals. Matriarchs lead family groups, and elephants demonstrate remarkable memory and problem-solving abilities.",
        mood: "Elephants show contentment through gentle trunk movements, relaxed ears, and peaceful social interactions. Happy elephants engage in play, gentle touching, and calm vocalizations.",
        patterns: "Movement patterns include seasonal migrations, family group travel, and coordinated responses to threats."
      },
      'Tiger': {
        analysis: "Tigers are solitary hunters with territorial behavior. They use stealth and ambush techniques, marking territories with scent and vocalizations. Females care for cubs alone, teaching them hunting skills through play and practice.",
        mood: "Tigers display alert and focused moods when hunting, but can show relaxed contentment when resting. Content tigers have relaxed facial expressions and comfortable body posture.",
        patterns: "Movement patterns include territorial patrolling, stalking prey, and seasonal movements for mating."
      }
    };

    return behaviorData[species] || {
      analysis: "Animal behavior varies greatly by species and individual. Video analysis can reveal movement patterns, social interactions, feeding behaviors, and communication methods unique to each species.",
      mood: "Animal mood can be assessed through body language, facial expressions, vocalizations, and overall demeanor. Understanding animal emotions helps in conservation and welfare efforts.",
      patterns: "Behavioral patterns are influenced by habitat, social structure, and environmental conditions."
    };
  };

  const behaviorInfo = getBehaviorInfo(commonName);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavior & Mood Analysis</h3>
      
      <div className="space-y-6">
        {/* Behavior Analysis */}
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
            <span className="text-orange-500 mr-2">🎬</span>
            Video Behavior Analysis
          </h4>
          <p className="text-orange-800 leading-relaxed">
            {behaviorInfo.analysis}
          </p>
        </div>

        {/* Mood Analysis */}
        <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
          <h4 className="font-semibold text-pink-900 mb-3 flex items-center">
            <span className="text-pink-500 mr-2">😊</span>
            Emotional State & Mood Analysis
          </h4>
          <p className="text-pink-800 leading-relaxed">
            {behaviorInfo.mood}
          </p>
        </div>

        {/* Mood Indicators */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
          <h4 className="font-semibold text-pink-900 mb-4 flex items-center">
            <span className="text-pink-500 mr-2">🔍</span>
            Mood Indicators
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Positive Mood Indicators */}
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-800 mb-3 flex items-center">
                <span className="text-green-500 mr-2">😊</span>
                Positive Mood Signs
              </h5>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Relaxed body posture</li>
                <li>• Playful behavior</li>
                <li>• Content vocalizations</li>
                <li>• Social interactions</li>
                <li>• Comfortable grooming</li>
                <li>• Alert but calm demeanor</li>
              </ul>
            </div>

            {/* Negative Mood Indicators */}
            <div className="bg-white p-4 rounded-lg border border-red-200">
              <h5 className="font-medium text-red-800 mb-3 flex items-center">
                <span className="text-red-500 mr-2">😰</span>
                Stress/Agitation Signs
              </h5>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Tense body posture</li>
                <li>• Aggressive displays</li>
                <li>• Fearful behavior</li>
                <li>• Avoidance responses</li>
                <li>• Excessive vocalizations</li>
                <li>• Defensive posturing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Behavior Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Movement Patterns */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="text-blue-500 mr-2">🏃</span>
              Movement Patterns
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Walking and running gaits</li>
              <li>• Swimming and diving techniques</li>
              <li>• Flying and gliding patterns</li>
              <li>• Climbing and jumping abilities</li>
              <li>• Territorial patrolling</li>
              <li>• Migration behaviors</li>
            </ul>
          </div>

          {/* Social Interactions */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <span className="text-green-500 mr-2">👥</span>
              Social Interactions
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Group dynamics and hierarchy</li>
              <li>• Mating rituals and courtship</li>
              <li>• Parental care and nurturing</li>
              <li>• Communication signals</li>
              <li>• Play behavior</li>
              <li>• Aggression and dominance</li>
            </ul>
          </div>

          {/* Feeding Behavior */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
              <span className="text-purple-500 mr-2">🍽️</span>
              Feeding Behavior
            </h4>
            <ul className="space-y-2 text-sm text-purple-800">
              <li>• Hunting techniques and strategies</li>
              <li>• Foraging patterns</li>
              <li>• Food storage and caching</li>
              <li>• Cooperative hunting</li>
              <li>• Feeding hierarchy</li>
              <li>• Dietary preferences</li>
            </ul>
          </div>

          {/* Communication */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
              <span className="text-yellow-500 mr-2">🗣️</span>
              Communication
            </h4>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Vocalizations and calls</li>
              <li>• Body language and gestures</li>
              <li>• Scent marking and pheromones</li>
              <li>• Visual displays</li>
              <li>• Warning signals</li>
              <li>• Courtship displays</li>
            </ul>
          </div>
        </div>

        {/* Behavioral Insights */}
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
            <span className="text-indigo-500 mr-2">🧠</span>
            Behavioral Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
            <div>
              <h5 className="font-medium mb-2">Cognitive Abilities</h5>
              <p>Problem-solving, tool use, memory, learning patterns, and social intelligence</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Environmental Adaptation</h5>
              <p>How the animal adapts to seasonal changes, weather conditions, and habitat modifications</p>
            </div>
            <div>
              <h5 className="font-medium mb-2">Conservation Behavior</h5>
              <p>Behaviors that help the species survive and adapt to changing environments</p>
            </div>
          </div>
        </div>

        {/* Research Applications */}
        <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
          <h4 className="font-semibold text-teal-900 mb-3 flex items-center">
            <span className="text-teal-500 mr-2">🔬</span>
            Research Applications
          </h4>
          <div className="text-sm text-teal-800 space-y-2">
            <p>Understanding animal behavior through video analysis helps researchers:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Study population dynamics and social structures</li>
              <li>Monitor health and stress levels in wild populations</li>
              <li>Develop better conservation strategies</li>
              <li>Understand species interactions and ecosystem roles</li>
              <li>Track behavioral changes due to environmental factors</li>
              <li>Improve captive breeding and reintroduction programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Behavior; 