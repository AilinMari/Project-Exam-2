export const handlePrevImage = (
  currentIndex: number,
  imagesLength: number,
  setCurrentIndex: (index: number) => void
) => {
  if (imagesLength > 0) {
    setCurrentIndex(currentIndex === 0 ? imagesLength - 1 : currentIndex - 1);
  }
};
