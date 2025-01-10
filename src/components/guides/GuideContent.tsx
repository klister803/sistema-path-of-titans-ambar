import React from 'react';
import { motion } from 'framer-motion';
import { useGuidesStore } from '../../stores/guidesStore';

interface GuideContentProps {
  guideId: string;
}

const GuideContent: React.FC<GuideContentProps> = ({ guideId }) => {
  const guide = useGuidesStore(state => state.guides.find(g => g.id === guideId));

  if (!guide) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-invert prose-amber max-w-none"
      dangerouslySetInnerHTML={{ __html: guide.content }}
    />
  );
};

export default GuideContent;
