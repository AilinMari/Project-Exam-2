import { useState, useEffect } from 'react';
import { Media } from '../../types';
import { handlePrevImage as prevImage } from './ImageCarousel/handlers/handlePrevImage';
import { handleNextImage as nextImage } from './ImageCarousel/handlers/handleNextImage';
import NavigationButtons from './ImageCarousel/components/NavigationButtons';
import ImageCounter from './ImageCarousel/components/ImageCounter';
import DotIndicators from './ImageCarousel/components/DotIndicators';

interface ImageCarouselProps {
  images: Media[];
  venueName: string;
}

export default function ImageCarousel({ images, venueName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPrevImage = () => {
    prevImage(currentIndex, images.length, setCurrentIndex);
  };

  const onNextImage = () => {
    nextImage(currentIndex, images.length, setCurrentIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrevImage();
      } else if (e.key === 'ArrowRight') {
        onNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-400">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-96 bg-gray-200">
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || `${venueName} ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          <NavigationButtons onPrevious={onPrevImage} onNext={onNextImage} />
          <DotIndicators 
            total={images.length} 
            currentIndex={currentIndex} 
            onSelect={setCurrentIndex} 
          />
        </>
      )}
      
      <ImageCounter current={currentIndex} total={images.length} />
    </div>
  );
}
