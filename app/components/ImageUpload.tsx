import React, { useState, useRef, useEffect } from 'react';
import CardBody from './CardBody';
import FoodChainGraph from './FoodChainGraph';
import Habitat from './Habitat';
import Conservation from './Conservation';

interface SpeciesData {
  "Species Name": string;
  "Common Name": string;
  "Description": string;
  "Food Chain": string;
  "Habitat": string;
  "Habitat Hotspots": Array<{
    Name: string;
    Region: string;
    Latitude: number;
    Longitude: number;
    Description: string;
    "Population Status": string;
    "Conservation Status": string;
  }>;
  "Conservation Efforts": string;
  "How to Help": string;
}

interface UploadedItem {
  image: string;
  speciesData: SpeciesData;
}

const ImageUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<'foodChain' | 'habitat' | 'conservation'>('foodChain');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const uploadToAPI = async (file: File): Promise<SpeciesData> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    
    try {
      const newItems: UploadedItem[] = [];
      
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          // Create image preview
          const imageUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });

          // Upload to API
          const speciesData = await uploadToAPI(file);
          
          newItems.push({
            image: imageUrl,
            speciesData
          });

          // Save to localStorage for analytics
          saveToAnalytics(speciesData, imageUrl, 'image');
        }
      }
      
      setUploadedItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const saveToAnalytics = (speciesData: SpeciesData, mediaUrl: string, type: 'image' | 'video') => {
    try {
      // Format habitat data to extract the most relevant information
      let habitatString = "Unknown habitat";
      if (speciesData["Habitat"]) {
        if (typeof speciesData["Habitat"] === 'object' && speciesData["Habitat"] !== null) {
          // If it's a structured habitat object, extract the most relevant info
          if (speciesData["Habitat"]['Geographic Regions']) {
            habitatString = speciesData["Habitat"]['Geographic Regions'];
          } else if (speciesData["Habitat"]['Biomes']) {
            habitatString = speciesData["Habitat"]['Biomes'];
          } else {
            habitatString = JSON.stringify(speciesData["Habitat"]);
          }
        } else {
          habitatString = String(speciesData["Habitat"]);
        }
      }

      const entry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        speciesName: speciesData["Species Name"],
        commonName: speciesData["Common Name"],
        imageUrl: type === 'image' ? mediaUrl : undefined,
        videoUrl: type === 'video' ? mediaUrl : undefined,
        habitat: habitatString,
        conservationStatus: "Stable", // Default, could be enhanced with actual status
        type: type
      };

      const existingEntries = localStorage.getItem('wildwatch_entries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      entries.push(entry);
      localStorage.setItem('wildwatch_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving to analytics:', error);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeItem = (index: number) => {
    setUploadedItems(prev => prev.filter((_, i) => i !== index));
  };

  const getImageOrientation = (imageUrl: string): Promise<'landscape' | 'portrait'> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const orientation = img.width > img.height ? 'landscape' : 'portrait';
        resolve(orientation);
      };
      img.src = imageUrl;
    });
  };

  const [imageOrientations, setImageOrientations] = useState<{ [key: number]: 'landscape' | 'portrait' }>({});

  // Update image orientations when items change
  useEffect(() => {
    const updateOrientations = async () => {
      const orientations: { [key: number]: 'landscape' | 'portrait' } = {};
      for (let i = 0; i < uploadedItems.length; i++) {
        orientations[i] = await getImageOrientation(uploadedItems[i].image);
      }
      setImageOrientations(orientations);
    };
    
    if (uploadedItems.length > 0) {
      updateOrientations();
    }
  }, [uploadedItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Upload Area - Only show if no species have been identified */}
        {uploadedItems.length === 0 && (
          <div className="grid grid-cols-1 gap-8">
            <CardBody>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h3>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-6xl mb-4">🦁</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop images here or click to browse
                </h4>
                <p className="text-gray-600 mb-4">
                  Upload animal images to identify species and get detailed information
                </p>
                <button
                  onClick={onButtonClick}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>

              {uploading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                    <span className="text-blue-700">Analyzing image...</span>
                  </div>
                </div>
              )}
            </CardBody>
          </div>
        )}

        {/* Identified Species - Show after successful upload */}
        {uploadedItems.length > 0 && (
          <div className="space-y-6">
            {uploadedItems.map((item, index) => {
              const orientation = imageOrientations[index];
              
              return (
                <div key={index} className="space-y-6">
                  <CardBody className="p-0 overflow-hidden">
                    {orientation === 'landscape' ? (
                      // Landscape layout: image above content
                      <div className="flex flex-col">
                        {/* Image Section - Above */}
                        <div className="relative flex items-center justify-center p-8 bg-gray-50">
                          <img
                            src={item.image}
                            alt={item.speciesData["Common Name"]}
                            className="w-full max-w-2xl h-auto object-cover rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => removeItem(index)}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          >
                            ×
                          </button>
                        </div>
                        
                        {/* Content Section - Below */}
                        <div className="p-8">
                          <div className="space-y-4 mb-6">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 min-w-[120px]">Common Name:</span>
                              <span className="text-lg text-gray-900 ml-2">{item.speciesData["Common Name"]}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 min-w-[120px]">Species Name:</span>
                              <span className="text-lg text-gray-600 italic ml-2">{item.speciesData["Species Name"]}</span>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-start">
                              <span className="font-semibold text-gray-700 min-w-[120px] mt-1">Description:</span>
                              <p className="text-gray-700 text-lg leading-relaxed ml-2">
                                {item.speciesData["Description"]}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <button
                              onClick={() => {
                                setUploadedItems([]);
                                setDragActive(false);
                              }}
                              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                              Upload Another Image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Portrait layout: image on left, content on right
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Section - Left Half */}
                        <div className="relative flex items-center justify-center p-8">
                          <img
                            src={item.image}
                            alt={item.speciesData["Common Name"]}
                            className="w-full max-w-md h-auto object-cover rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => removeItem(index)}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          >
                            ×
                          </button>
                        </div>
                        
                        {/* Species Details - Right Half */}
                        <div className="p-8 flex flex-col justify-center">
                          <div className="space-y-4 mb-6">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 min-w-[120px]">Common Name:</span>
                              <span className="text-lg text-gray-900 ml-2">{item.speciesData["Common Name"]}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 min-w-[120px]">Species Name:</span>
                              <span className="text-lg text-gray-600 italic ml-2">{item.speciesData["Species Name"]}</span>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <div className="flex items-start">
                              <span className="font-semibold text-gray-700 min-w-[120px] mt-1">Description:</span>
                              <p className="text-gray-700 text-lg leading-relaxed ml-2">
                                {item.speciesData["Description"]}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <button
                              onClick={() => {
                                setUploadedItems([]);
                                setDragActive(false);
                              }}
                              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                            >
                              Upload Another Image
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                  
                  {/* Horizontal Menu - Below image for both layouts */}
                  <div className="px-8 pb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveSection('foodChain')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeSection === 'foodChain'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        🦁 Food Chain Ecosystem
                      </button>
                      <button
                        onClick={() => setActiveSection('habitat')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeSection === 'habitat'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        🌍 Habitat & Distribution
                      </button>
                      <button
                        onClick={() => setActiveSection('conservation')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeSection === 'conservation'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        🛡️ Conservation & Help
                      </button>
                    </div>
                  </div>
                  
                  {/* Dynamic Section Content - Below menu for both layouts */}
                  <div className="px-8 pb-8">
                    {activeSection === 'foodChain' && (
                      <FoodChainGraph foodChain={item.speciesData["Food Chain"]} />
                    )}
                    {activeSection === 'habitat' && (
                      <Habitat 
                        speciesName={item.speciesData["Species Name"]} 
                        commonName={item.speciesData["Common Name"]}
                        habitatData={item.speciesData["Habitat"]}
                        habitatHotspots={item.speciesData["Habitat Hotspots"]}
                      />
                    )}
                    {activeSection === 'conservation' && (
                      <Conservation 
                        speciesName={item.speciesData["Species Name"]} 
                        commonName={item.speciesData["Common Name"]}
                        conservationEfforts={item.speciesData["Conservation Efforts"]}
                        howToHelp={item.speciesData["How to Help"]}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 