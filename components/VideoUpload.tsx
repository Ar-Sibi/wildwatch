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

        // Save to localStorage for analytics
        saveToAnalytics(speciesData, videoUrl, 'video');
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
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      speciesName: speciesData["Species Name"],
      commonName: speciesData["Common Name"],
      imageUrl: type === 'image' ? mediaUrl : undefined,
      videoUrl: type === 'video' ? mediaUrl : undefined,
      habitat: speciesData["Habitat"] || "Unknown habitat",
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