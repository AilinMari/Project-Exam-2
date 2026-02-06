export const handleNextImage = (
  currentIndex: number,
  imagesLength: number,
  setCurrentIndex: (index: number) => void
) => {
  if (imagesLength > 0) {
    setCurrentIndex(currentIndex === imagesLength - 1 ? 0 : currentIndex + 1);
  }
};
