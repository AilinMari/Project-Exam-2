interface DotIndicatorsProps {
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function DotIndicators({ total, currentIndex, onSelect }: DotIndicatorsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentIndex
              ? 'bg-white w-8'
              : 'bg-white/50 hover:bg-white/75'
          }`}
          aria-label={`Go to image ${index + 1}`}
        />
      ))}
    </div>
  );
}
