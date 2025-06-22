import React, { useState, useRef } from 'react';
import CardBody from './CardBody';

interface SpeciesData {
  "Species Name": string;
  "Common Name": string;
  "Description": string;
}

interface UploadedItem {
  image: string;
  speciesData: SpeciesData;
}

const ImageUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]);
  const [uploading, setUploading] = useState(false);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Species Identification</h1>
          <p className="text-lg text-gray-600">Upload images to identify species and learn more about them.</p>
        </div>

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
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="text-blue-700">Analyzing species...</span>
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
              <CardBody key={index} className="p-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image Section - Left Half */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.speciesData["Common Name"]}
                      className="w-full h-96 lg:h-full object-cover"
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
              </CardBody>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload; 