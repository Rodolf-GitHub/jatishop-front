export const getImageUrl = (imagen) => {
  if (!imagen) return "/placeholder-image.png";

  if (imagen.startsWith("http")) {
    return imagen;
  }

  if (imagen.startsWith("/media/")) {
    return `${import.meta.env.VITE_MEDIA_URL}${imagen}`;
  }

  return `${import.meta.env.VITE_MEDIA_URL}/media/${imagen}`;
};
