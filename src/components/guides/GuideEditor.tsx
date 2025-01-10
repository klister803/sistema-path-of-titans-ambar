import React, { useEffect, useRef } from 'react';
import { useGuidesStore } from '../../stores/guidesStore';

interface GuideEditorProps {
  guideId: string;
}

export const GuideEditor: React.FC<GuideEditorProps> = ({ guideId }) => {
  const { guides, updateGuide } = useGuidesStore();
  const guide = guides.find(g => g.id === guideId);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!editorRef.current || !guide) return;

    const handleInput = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (editorRef.current) {
          updateGuide(guideId, {
            ...guide,
            content: editorRef.current.innerHTML,
            lastModified: new Date().toISOString()
          });
        }
      }, 1000);
    };

    editorRef.current.innerHTML = guide.content;
    editorRef.current.addEventListener('input', handleInput);

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('input', handleInput);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [guide, guideId, updateGuide]);

  if (!guide) return null;

  return (
    <div>
      <div
        ref={editorRef}
        contentEditable
        className="prose prose-invert prose-amber max-w-none focus:outline-none"
        suppressContentEditableWarning
      />
      <div className="mt-4 text-sm text-[rgba(var(--color-gold),0.6)]">
        Última modificação: {new Date(guide.lastModified).toLocaleString()}
      </div>
    </div>
  );
};
