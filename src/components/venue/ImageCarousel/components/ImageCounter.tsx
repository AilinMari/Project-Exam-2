interface ImageCounterProps {
  current: number;
  total: number;
}

export default function ImageCounter({ current, total }: ImageCounterProps) {
  return (
    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
      {current + 1} / {total}
    </div>
  );
}
