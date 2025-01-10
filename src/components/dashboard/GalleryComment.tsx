import React from 'react';

interface GalleryCommentProps {
  comment: {
    user: string;
    text: string;
    time: string;
  };
}

export const GalleryComment: React.FC<GalleryCommentProps> = ({ comment }) => {
  return (
    <div className="p-3 rounded-lg bg-[rgba(var(--color-gold),0.1)]">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-[rgb(var(--color-gold))]">{comment.user}</span>
        <span className="text-sm text-[rgba(var(--color-gold),0.7)]">{comment.time}</span>
      </div>
      <p className="text-[rgba(var(--color-gold),0.8)]">{comment.text}</p>
    </div>
  );
};
