import React from 'react';
import { motion } from 'framer-motion';
import MediaCard from '@/components/molecules/MediaCard';
import Empty from '@/components/ui/Empty';
import { formatDate } from '@/utils/dateUtils';

const MediaTimeline = ({ media, onMediaClick, onMediaDelete }) => {
  if (!media || media.length === 0) {
    return (
      <Empty
        title="No Updates Yet"
        description="Start documenting progress by capturing photos and videos of your project"
        actionText="Capture First Update"
        iconName="Camera"
        onAction={() => {
          // This would navigate to capture screen
          console.log('Capture first update clicked');
        }}
      />
    );
  }

  // Group media by date
  const groupedMedia = media.reduce((groups, item) => {
    const date = formatDate(item.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedMedia).map(([date, items], groupIndex) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <h3 className="font-display font-bold text-lg text-gray-900">
              {date}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
            {items.map((item, index) => (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
              >
                <MediaCard
                  media={item}
                  onClick={onMediaClick}
                  onDelete={onMediaDelete}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MediaTimeline;