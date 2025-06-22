import React, { useState, useRef, useEffect } from 'react';
import CardBody from './CardBody';
import FoodChainGraph from './FoodChainGraph';
import Habitat from './Habitat';
import Conservation from './Conservation';
import Behavior from './Behavior';

interface SpeciesData {
  "Species Name": string;
  "Common Name": string;
  "Description": string;
  "Behavior Analysis": string;
  "Mood Analysis": string;
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
  video: string;
  thumbnail: string;
  speciesData: SpeciesData;
}

const VideoUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<'behavior' | 'foodChain' | 'habitat' | 'conservation'>('behavior');
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
    formData.append('video', file);

    const response = await fetch('http://localhost:8000/upload-video', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  };

  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        // Set video to 1 second in to get a good frame
        video.currentTime = 1;
      };
      
      video.onseeked = () => {
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        }
      };
      
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleFiles = async (files: FileList) => {
    setUploading(true);
    
    try {
      const newItems: UploadedItem[] = [];
      
      for (const file of Array.from(files)) {
        if (file.type.startsWith('video/')) {
          // Create video preview URL
          const videoUrl = URL.createObjectURL(file);
          
          // Generate thumbnail
          const thumbnailUrl = await generateThumbnail(file);

          // Upload to API
          const speciesData = await uploadToAPI(file);
          
          newItems.push({
            video: videoUrl,
            thumbnail: thumbnailUrl,
            speciesData
          });
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

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeItem = (index: number) => {
    setUploadedItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Upload Area - Only show if no species have been identified */}
        {uploadedItems.length === 0 && (
          <div className="grid grid-cols-1 gap-8">
            <CardBody>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Videos</h3>
              
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
                <div className="text-6xl mb-4">🎬</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop videos here or click to browse
                </h4>
                <p className="text-gray-600 mb-4">
                  Upload wildlife videos to identify species and get detailed information
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
                  accept="video/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>

              {uploading && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                    <span className="text-blue-700">Analyzing video...</span>
                  </div>
                </div>
              )}
            </CardBody>
          </div>
        )}

        {/* Identified Species - Show after successful upload */}
        {uploadedItems.length > 0 && (
          <div className="space-y-6">
            {uploadedItems.map((item, index) => (
              <div key={index} className="space-y-6">
                <CardBody className="p-0 overflow-hidden">
                  <div className="flex flex-col">
                    {/* Video Section - Above */}
                    <div className="relative flex items-center justify-center p-8 bg-gray-50">
                      <video
                        src={item.video}
                        controls
                        className="w-full max-w-2xl h-auto rounded-lg shadow-md"
                        poster={item.thumbnail}
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
                          Upload Another Video
                        </button>
                      </div>
                    </div>
                  </div>
                </CardBody>
                
                {/* Horizontal Menu - Below video */}
                <div className="px-8 pb-6">
                  <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveSection('behavior')}
                      className={`flex-1 min-w-[140px] py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeSection === 'behavior'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      🐾 Behavior
                    </button>
                    <button
                      onClick={() => setActiveSection('foodChain')}
                      className={`flex-1 min-w-[140px] py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeSection === 'foodChain'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      🦁 Food Chain
                    </button>
                    <button
                      onClick={() => setActiveSection('habitat')}
                      className={`flex-1 min-w-[140px] py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeSection === 'habitat'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      🌍 Habitat
                    </button>
                    <button
                      onClick={() => setActiveSection('conservation')}
                      className={`flex-1 min-w-[140px] py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeSection === 'conservation'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      🛡️ Conservation
                    </button>
                  </div>
                </div>
                
                {/* Dynamic Section Content - Below menu */}
                <div className="px-8 pb-8">
                  {activeSection === 'behavior' && (
                    <Behavior 
                      speciesName={item.speciesData["Species Name"]} 
                      commonName={item.speciesData["Common Name"]}
                      behaviorAnalysis={item.speciesData["Behavior Analysis"]}
                      moodAnalysis={item.speciesData["Mood Analysis"]}
                    />
                  )}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload; 