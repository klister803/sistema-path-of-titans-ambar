import React from 'react';

interface ImageContainerProps {
  src: string;
  alt: string;
  variant: 'card' | 'preview' | 'featured';
  className?: string;
}

const aspectRatios = {
  card: 'aspect-video',
  preview: 'aspect-video',
  featured: 'aspect-video',
};

export const ImageContainer: React.FC<ImageContainerProps> = ({
  src,
  alt,
  variant,
  className = '',
}) => {
  const aspectRatioClass = aspectRatios[variant];
  const fallbackImage = '/src/fotos-ambar/background-news.png';
  
  return (
    <div className={`relative overflow-hidden ${aspectRatioClass} ${className}`}>
      <picture>
        <source
          srcSet={src.replace(/\.[^.]+$/, '.webp')}
          type="image/webp"
          className="w-full h-full"
        />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center rounded-lg transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = fallbackImage;
          }}
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
