import React, { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useMedia } from "@/hooks/useMedia";
import { useCompliance } from "@/hooks/useCompliance";
import { useProjects } from "@/hooks/useProjects";
import { PROJECT_STAGES } from "@/utils/stageUtils";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
const CaptureScreen = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'photo';
  
  const [captureType, setCaptureType] = useState(initialType);
  const [selectedProject, setSelectedProject] = useState(projectId || '');
  const [selectedStage, setSelectedStage] = useState('Demo');
const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  
  const fileInputRef = useRef(null);
  const { createMedia } = useMedia();
  const { markProjectUpdated } = useCompliance();
  const { projects, loading: projectsLoading } = useProjects();
const addPhoto = (photoData) => {
    setPhotos(prev => [...prev, { ...photoData, id: Date.now() }]);
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

const handleCameraCapture = async () => {
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Camera not supported by this browser');
        return;
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      // Create video element to capture frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        // Create canvas to capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const newPhoto = {
            type: 'photo',
            url: url,
            timestamp: new Date().toISOString(),
            file: blob
          };
          
          addPhoto(newPhoto);
          
          // Stop camera stream
          stream.getTracks().forEach(track => track.stop());
          toast.success(`Photo ${photos.length + 1} captured successfully!`);
        }, 'image/jpeg', 0.9);
      };
      
} catch (error) {
      console.error('Camera access error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Camera access denied. To use your camera, please click the camera icon in your browser\'s address bar and allow camera access, then try again. Alternatively, you can use the "Upload" button to select photos from your device.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera detected on this device. Please use the "Upload" button to select photos from your device gallery instead.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Camera is currently being used by another application. Please close any other camera apps (like video calls, photo apps) and try again, or use the "Upload" button to select existing photos.');
      } else if (error.name === 'OverconstrainedError') {
        toast.info('Trying camera with basic settings...');
        // Try again with basic constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          // Create video element to capture frame with fallback settings
          const video = document.createElement('video');
          video.srcObject = fallbackStream;
          video.play();
          
          video.onloadedmetadata = () => {
            // Create canvas to capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Convert to blob
            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const newPhoto = {
                type: 'photo',
                url: url,
                timestamp: new Date().toISOString(),
                file: blob
              };
              
              addPhoto(newPhoto);
              
              // Stop camera stream
              fallbackStream.getTracks().forEach(track => track.stop());
              toast.success(`Photo ${photos.length + 1} captured successfully with basic camera settings!`);
            }, 'image/jpeg', 0.9);
          };
          
        } catch (fallbackError) {
          console.error('Fallback camera access failed:', fallbackError);
          toast.error('Camera access failed with both advanced and basic settings. Please use the "Upload" button to select photos from your device.');
        }
      } else if (error.name === 'NotSupportedError') {
        toast.error('Camera is not supported by this browser. Please try using Chrome, Firefox, Safari, or Edge, or use the "Upload" button to select photos.');
      } else if (error.name === 'AbortError') {
        toast.error('Camera access was interrupted. Please try again or use the "Upload" button to select photos from your device.');
      } else {
        toast.error('Unable to access camera. This may be due to browser security settings or hardware issues. Please try refreshing the page, check your browser permissions, or use the "Upload" button to select photos from your device.');
      }
      
      // Only add fallback photo for non-permission errors to avoid confusion
      if (error.name !== 'NotAllowedError' && error.name !== 'NotFoundError') {
        const fallbackPhoto = {
          type: 'photo',
          url: '/api/placeholder/800/600',
          timestamp: new Date().toISOString()
        };
        addPhoto(fallbackPhoto);
      }
    }
  };

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const fileType = file.type.startsWith('video/') ? 'video' : 'photo';
      if (fileType === 'photo') {
        const newPhoto = {
          type: 'photo',
          url: URL.createObjectURL(file),
          timestamp: new Date().toISOString(),
          file: file
        };
        addPhoto(newPhoto);
      }
    });
    
    if (files.length > 0) {
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded successfully!`);
    }
  };

const handleVideoRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Video recording functionality not implemented yet
      toast.info('Video recording feature coming soon');
    } else {
      setIsRecording(true);
      toast.info('Video recording started (max 30 seconds)');
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording) {
          handleVideoRecord();
        }
      }, 30000);
    }
  };

const handleSave = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    if (photos.length === 0) {
      toast.error('Please capture some photos first');
      return;
    }

    if (!selectedStage) {
      toast.error('Please select a project stage');
      return;
    }

try {
      setIsUploading(true);
      
      const mediaData = {
        projectId: selectedProject,
        type: 'photo',
        stage: selectedStage,
        notes: notes.trim(),
        photos: photos
      };

      await createMedia(mediaData);
      
// Mark project as updated to clear compliance flags
      if (selectedProject) {
        await markProjectUpdated(selectedProject);
      }
      
      toast.success(`${photos.length} photo${photos.length > 1 ? 's' : ''} uploaded successfully!`);
      
      // Navigate back
      if (selectedProject) {
        navigate(`/project/${selectedProject}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

const handleDiscard = () => {
    clearPhotos();
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </motion.button>
<div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Capture Update
              </h1>
              <p className="text-gray-600">
                {selectedProject ? 
                  projects.find(p => p.Id === parseInt(selectedProject))?.Name || `Project #${selectedProject}` : 
                  'Select a project'
                }
              </p>
            </div>
            <Badge variant="primary">
              {captureType === 'video' ? 'Video' : 'Photo'}
            </Badge>
          </div>
        </div>
      </div>

{/* Content */}
      <div className="p-4 space-y-6">
        {/* Project Selection */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Select Project <span className="text-red-500">*</span>
          </h3>
          {projectsLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">Loading projects...</span>
            </div>
          ) : (
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={`w-full p-3 border-2 rounded-lg transition-all ${
                selectedProject 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-red-300 bg-red-50 text-gray-700'
              }`}
              required
            >
              <option value="">Choose a project...</option>
              {projects.map((project) => (
                <option key={project.Id} value={project.Id}>
                  {project.Name} - {project.address}
                </option>
              ))}
            </select>
          )}
          {!selectedProject && (
            <p className="text-red-500 text-sm mt-2">
              Please select a project before capturing media
            </p>
          )}
        </div>
        {/* Capture Type Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Capture Type
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCaptureType('photo')}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                captureType === 'photo'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <ApperIcon name="Camera" size={20} />
              Photo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCaptureType('video')}
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                captureType === 'video'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
              }`}
            >
              <ApperIcon name="Video" size={20} />
              Video
            </motion.button>
          </div>
        </div>

        {/* Capture Area */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Capture Media
          </h3>
          
{photos.length === 0 ? (
            <div className="space-y-4">
              {/* Camera Preview Area */}
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <ApperIcon name="Camera" size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Ready to take photos</p>
                  <p className="text-sm text-gray-400 mt-1">You can capture multiple photos in one update</p>
                </div>
              </div>
              
              {/* Capture Controls */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  icon="Upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedProject}
                >
                  Upload
                </Button>
                
                <Button
                  variant="primary"
                  icon="Camera"
                  onClick={handleCameraCapture}
                  className="col-span-2"
                  disabled={!selectedProject}
                >
                  Take Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Photo Count and Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Images" size={20} className="text-primary-600" />
                  <span className="font-medium text-gray-900">
                    {photos.length} photo{photos.length > 1 ? 's' : ''} captured
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Camera"
                  onClick={handleCameraCapture}
                  disabled={!selectedProject}
                >
                  Add More
                </Button>
              </div>

              {/* Photo Carousel */}
              <div className="space-y-3">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="relative flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img 
                          src={photo.url} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <ApperIcon name="X" size={12} />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Batch Controls */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  icon="RotateCcw"
                  onClick={handleDiscard}
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  icon="Upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedProject}
                >
                  Add Files
                </Button>
              </div>
            </div>
          )}
          
<input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Stage Selection */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Project Stage
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PROJECT_STAGES.map((stage) => (
              <motion.button
                key={stage.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStage(stage.key)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedStage === stage.key
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                <ApperIcon name={stage.icon} size={16} />
                <span className="text-sm font-medium">{stage.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <Input
            label="Update Notes"
            type="text"
            placeholder="Describe what's happening in this update..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            icon="FileText"
          />
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isUploading}
onClick={handleSave}
            icon="Upload"
            disabled={photos.length === 0 || !selectedProject}
          >
            {isUploading ? 'Uploading...' : `Save ${photos.length} Photo${photos.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaptureScreen;