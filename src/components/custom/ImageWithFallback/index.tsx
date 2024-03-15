import Image, { ImageProps } from 'next/image';
import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends ImageProps {
  fallback?: string;
  alt: string;
  src: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = '/user.svg',
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState<null | boolean>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;