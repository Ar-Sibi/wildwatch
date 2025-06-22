import React from 'react';

interface ConservationProps {
  speciesName: string;
  commonName: string;
  conservationEfforts?: string;
  howToHelp?: string;
}

const Conservation: React.FC<ConservationProps> = ({ 
  speciesName, 
  commonName, 
  conservationEfforts, 
  howToHelp 
}) => {
  // Helper function to convert object to string if needed
  const formatText = (data: any): string => {
    if (typeof data === 'string') {
      // Check if it's a JSON string and try to parse it
      if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(data);
          return formatStructuredData(parsed);
        } catch (e) {
          // If parsing fails, return as regular string
          return data;
        }
      }
      return data;
    } else if (Array.isArray(data)) {
      // Handle arrays - format as bullet points
      return data.map((item, index) => {
        if (typeof item === 'string') {
          return `• ${item}`;
        } else if (typeof item === 'object' && item !== null) {
          return formatStructuredData(item);
        }
        return `• ${String(item)}`;
      }).join('\n\n');
    } else if (typeof data === 'object' && data !== null) {
      // Convert object to formatted string
      return formatStructuredData(data);
    }
    return String(data || '');
  };

  // Helper function to format structured data in a user-friendly way
  const formatStructuredData = (data: any): string => {
    if (typeof data === 'string') {
      return data;
    } else if (Array.isArray(data)) {
      return data.map((item, index) => {
        if (typeof item === 'string') {
          return `• ${item}`;
        } else if (typeof item === 'object' && item !== null) {
          // Handle objects with Action, Link, Description structure
          if (item.Action && item.Description) {
            let result = `**${item.Action}**`;
            if (item.Link) {
              result += ` (${item.Link})`;
            }
            result += `: ${item.Description}`;
            return result;
          }
          // Handle other object structures
          return Object.entries(item)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        }
        return `• ${String(item)}`;
      }).join('\n\n');
    } else if (typeof data === 'object' && data !== null) {
      const sections: string[] = [];
      
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          sections.push(`**${key}:**\n${value.map((item, index) => `• ${item}`).join('\n')}`);
        } else if (typeof value === 'object' && value !== null) {
          sections.push(`**${key}:**\n${formatStructuredData(value)}`);
        } else {
          sections.push(`**${key}:** ${value}`);
        }
      }
      
      return sections.join('\n\n');
    }
    return String(data);
  };

  // Format the data
  const formattedConservationEfforts = formatText(conservationEfforts);
  const formattedHowToHelp = formatText(howToHelp);

  // Extract links from text and format them
  const extractAndFormatLinks = (text: string) => {
    if (!text || typeof text !== 'string') return [];
    
    // Find URLs in the text - improved regex to catch more formats
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const matches = text.match(urlRegex) || [];
    
    console.log('Raw text:', text);
    console.log('URL matches found:', matches);
    
    return matches.map((url, index) => {
      // Clean up the URL (remove trailing punctuation)
      const cleanUrl = url.replace(/[.,;!?\)]+$/, '');
      const domain = cleanUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      return {
        url: cleanUrl,
        domain,
        id: index
      };
    });
  };

  const conservationLinks = extractAndFormatLinks(formattedConservationEfforts);
  const helpLinks = extractAndFormatLinks(formattedHowToHelp);

  // Debug logging
  console.log('Conservation efforts text:', formattedConservationEfforts);
  console.log('How to help text:', formattedHowToHelp);
  console.log('Conservation links found:', conservationLinks);
  console.log('Help links found:', helpLinks);

  // If we have conservation data from the API, display it
  if (formattedConservationEfforts && formattedConservationEfforts !== "No conservation information available.") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservation & How to Help</h3>
        
        <div className="space-y-6">
          {/* Conservation Efforts */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center">
              <span className="text-green-500 mr-2">🛡️</span>
              Ongoing Conservation Efforts
            </h4>
            <div className="text-green-800 leading-relaxed mb-4 whitespace-pre-line">
              {formattedConservationEfforts && formattedConservationEfforts !== "No conservation information available." ? (
                <div className="space-y-3">
                  {formattedConservationEfforts.split('\n\n').map((section, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-green-100">
                      {section.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          // Bold section headers
                          return (
                            <div key={lineIndex} className="font-semibold text-green-900 mb-2">
                              {line.replace(/\*\*/g, '')}
                            </div>
                          );
                        } else if (line.startsWith('•')) {
                          // Bullet points
                          return (
                            <div key={lineIndex} className="ml-4 text-green-800">
                              {line}
                            </div>
                          );
                        } else if (line.includes('**') && line.includes(':')) {
                          // Bold action with description
                          const parts = line.split(':');
                          const action = parts[0].replace(/\*\*/g, '');
                          const description = parts.slice(1).join(':');
                          return (
                            <div key={lineIndex} className="mb-2">
                              <span className="font-semibold text-green-900">{action}:</span>
                              <span className="text-green-800">{description}</span>
                            </div>
                          );
                        } else {
                          // Regular text
                          return (
                            <div key={lineIndex} className="text-green-800">
                              {line}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p>You can help wildlife conservation by supporting reputable conservation organizations, reducing your environmental impact, and educating others about the importance of biodiversity.</p>
              )}
            </div>
            
            {/* Conservation Links */}
            {conservationLinks.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-green-900 mb-2">Conservation Organizations:</h5>
                <div className="flex flex-wrap gap-2">
                  {conservationLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors duration-200"
                    >
                      <span className="mr-1">🔗</span>
                      {link.domain}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* How to Help */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="text-blue-500 mr-2">🤝</span>
              How You Can Help
            </h4>
            <div className="text-blue-800 leading-relaxed mb-4 whitespace-pre-line">
              {formattedHowToHelp && formattedHowToHelp !== "No information on how to help available." ? (
                <div className="space-y-3">
                  {formattedHowToHelp.split('\n\n').map((section, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-blue-100">
                      {section.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          // Bold section headers
                          return (
                            <div key={lineIndex} className="font-semibold text-blue-900 mb-2">
                              {line.replace(/\*\*/g, '')}
                            </div>
                          );
                        } else if (line.startsWith('•')) {
                          // Bullet points
                          return (
                            <div key={lineIndex} className="ml-4 text-blue-800">
                              {line}
                            </div>
                          );
                        } else if (line.includes('**') && line.includes(':')) {
                          // Bold action with description
                          const parts = line.split(':');
                          const action = parts[0].replace(/\*\*/g, '');
                          const description = parts.slice(1).join(':');
                          return (
                            <div key={lineIndex} className="mb-2">
                              <span className="font-semibold text-blue-900">{action}:</span>
                              <span className="text-blue-800">{description}</span>
                            </div>
                          );
                        } else {
                          // Regular text
                          return (
                            <div key={lineIndex} className="text-blue-800">
                              {line}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <p>You can help wildlife conservation by supporting reputable conservation organizations, reducing your environmental impact, and educating others about the importance of biodiversity. Consider donating to organizations like WWF, volunteering with local conservation groups, and making sustainable choices in your daily life.</p>
              )}
            </div>
            
            {/* Help Links */}
            {helpLinks.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium text-blue-900 mb-2">Take Action:</h5>
                <div className="flex flex-wrap gap-2">
                  {helpLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200"
                    >
                      <span className="mr-1">🔗</span>
                      {link.domain}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Resources */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
              <span className="text-purple-500 mr-2">📚</span>
              Additional Resources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-purple-800">Learn More:</h5>
                <ul className="space-y-1 text-sm text-purple-700">
                  <li>• IUCN Red List of Threatened Species</li>
                  <li>• CITES (Convention on International Trade)</li>
                  <li>• Local wildlife conservation groups</li>
                  <li>• Educational programs and documentaries</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h5 className="font-medium text-purple-800">Get Involved:</h5>
                <ul className="space-y-1 text-sm text-purple-700">
                  <li>• Volunteer with local conservation groups</li>
                  <li>• Support sustainable tourism</li>
                  <li>• Reduce your environmental impact</li>
                  <li>• Spread awareness on social media</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to placeholder data if no API data
  const getConservationInfo = (species: string) => {
    const conservationData: { [key: string]: any } = {
      'Lion': {
        efforts: "Lions are protected through various conservation initiatives including the Lion Recovery Fund, Panthera's Project Leonardo, and the Big Cats Initiative. Organizations like the World Wildlife Fund (WWF) and African Wildlife Foundation work to protect lion habitats and reduce human-lion conflicts.",
        help: "Support lion conservation by donating to organizations like WWF, African Wildlife Foundation, or Panthera. Choose sustainable tourism operators and reduce your carbon footprint to help protect lion habitats."
      },
      'Elephant': {
        efforts: "Elephant conservation efforts include anti-poaching measures, habitat protection, and community education programs. Organizations like Save the Elephants and the Elephant Crisis Fund work to protect these magnificent animals.",
        help: "Support elephant conservation by avoiding ivory products, donating to conservation organizations, and choosing responsible tourism operators that don't exploit elephants."
      },
      'Tiger': {
        efforts: "Tiger conservation focuses on habitat protection, anti-poaching measures, and community engagement. The Global Tiger Initiative and organizations like WWF work to double wild tiger populations by 2022.",
        help: "Help tigers by supporting conservation organizations, avoiding products made from tiger parts, and choosing sustainable palm oil products to protect tiger habitats."
      }
    };

    return conservationData[species] || {
      efforts: "Conservation efforts vary by species and region. Many organizations work to protect wildlife through habitat preservation, anti-poaching measures, and community education programs.",
      help: "You can help wildlife conservation by supporting reputable conservation organizations, reducing your environmental impact, and educating others about the importance of biodiversity."
    };
  };

  const conservationInfo = getConservationInfo(commonName);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservation & How to Help</h3>
      
      <div className="space-y-6">
        {/* Conservation Efforts */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
            <span className="text-green-500 mr-2">🛡️</span>
            Ongoing Conservation Efforts
          </h4>
          <div className="text-green-800 leading-relaxed mb-4 whitespace-pre-line">
            {conservationInfo.efforts}
          </div>
        </div>

        {/* How to Help */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <span className="text-blue-500 mr-2">🤝</span>
            How You Can Help
          </h4>
          <div className="text-blue-800 leading-relaxed mb-4 whitespace-pre-line">
            {conservationInfo.help}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
            <span className="text-purple-500 mr-2">📚</span>
            Additional Resources
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-purple-800">Learn More:</h5>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• IUCN Red List of Threatened Species</li>
                <li>• CITES (Convention on International Trade)</li>
                <li>• Local wildlife conservation groups</li>
                <li>• Educational programs and documentaries</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-purple-800">Get Involved:</h5>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• Volunteer with local conservation groups</li>
                <li>• Support sustainable tourism</li>
                <li>• Reduce your environmental impact</li>
                <li>• Spread awareness on social media</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conservation; 