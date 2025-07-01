import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import { useMedia } from '@/hooks/useMedia';
import { useCompliance } from '@/hooks/useCompliance';
import { PROJECT_STAGES } from '@/utils/stageUtils';

const CaptureScreen = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'photo';
  
  const [captureType, setCaptureType] = useState(initialType);
  const [selectedStage, setSelectedStage] = useState('Demo');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState(null);
  
  const fileInputRef = useRef(null);
  const { createMedia } = useMedia();
  const { markProjectUpdated } = useCompliance();

  const handleCameraCapture = () => {
    // In a real app, this would open the device camera
    toast.info('Camera functionality would open here');
    // Simulate captured media
    setCapturedMedia({
      type: captureType,
      url: '/api/placeholder/800/600',
      timestamp: new Date().toISOString()
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.startsWith('video/') ? 'video' : 'photo';
      setCaptureType(fileType);
      
      // In a real app, you'd process the file here
      setCapturedMedia({
        type: fileType,
        url: URL.createObjectURL(file),
        timestamp: new Date().toISOString(),
        file: file
      });
    }
  };

  const handleVideoRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate recorded video
      setCapturedMedia({
        type: 'video',
        url: '/api/placeholder/800/600',
        timestamp: new Date().toISOString()
      });
      toast.success('Video recording completed');
    } else {
      setIsRecording(true);
      toast.info('Video recording started (max 30 seconds)');
      // In a real app, start video recording
      setTimeout(() => {
        if (isRecording) {
          handleVideoRecord();
        }
      }, 30000); // Auto-stop after 30 seconds
    }
  };

  const handleSave = async () => {
    if (!capturedMedia) {
      toast.error('Please capture some media first');
      return;
    }

    if (!selectedStage) {
      toast.error('Please select a project stage');
      return;
    }

    try {
      setIsUploading(true);
      
      const mediaData = {
        projectId: projectId || '1',
        type: capturedMedia.type,
        stage: selectedStage,
        notes: notes.trim(),
      };

      await createMedia(mediaData);
      
      // Mark project as updated to clear compliance flags
      if (projectId) {
        await markProjectUpdated(projectId);
      }
      
      toast.success(`${capturedMedia.type === 'video' ? 'Video' : 'Photo'} uploaded successfully!`);
      
      // Navigate back
      if (projectId) {
        navigate(`/project/${projectId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDiscard = () => {
    setCapturedMedia(null);
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
                {projectId ? `Project #${projectId}` : 'Select a project'}
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
          
          {!capturedMedia ? (
            <div className="space-y-4">
              {/* Camera Preview Area */}
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <ApperIcon name={captureType === 'video' ? 'Video' : 'Camera'} size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {captureType === 'video' ? 'Ready to record video' : 'Ready to take photo'}
                  </p>
                </div>
              </div>
              
              {/* Capture Controls */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  icon="Upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
                
                {captureType === 'video' ? (
                  <Button
                    variant={isRecording ? 'danger' : 'primary'}
                    icon={isRecording ? 'Square' : 'Video'}
                    onClick={handleVideoRecord}
                    className="col-span-2"
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    icon="Camera"
                    onClick={handleCameraCapture}
                    className="col-span-2"
                  >
                    Take Photo
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={capturedMedia.url} 
                  alt="Captured media"
                  className="w-full h-full object-cover"
                />
                {capturedMedia.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <ApperIcon name="Play" size={32} className="text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Preview Controls */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  icon="RotateCcw"
                  onClick={handleDiscard}
                >
                  Retake
                </Button>
                <Button
                  variant="accent"
                  icon="Check"
                  onClick={() => {/* Preview/Edit */}}
                  className="flex-1"
                >
                  Preview
                </Button>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
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
            disabled={!capturedMedia}
          >
            {isUploading ? 'Uploading...' : 'Save Update'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaptureScreen;