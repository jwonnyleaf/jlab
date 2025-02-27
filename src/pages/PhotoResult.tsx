import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PHOTO_COUNT } from '../config/PhotoBoothConfig';

const PhotoResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const photos: string[] = location.state?.photos || [];

  useEffect(() => {
    if (photos.length !== PHOTO_COUNT) {
      navigate('/'); // Redirect if no valid photos
      return;
    }

    const mergeImages = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const finalWidth = 1080;
      const finalHeight = 1920;
      const edgePadding = 80;
      const imageGap = 20;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      const imgElements = await Promise.all(
        photos.map((src) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
          });
        })
      );

      const startY = edgePadding - 50;
      const effectiveHeight = finalHeight - startY * 2;
      const singleImageHeight = (effectiveHeight - imageGap * 2) / PHOTO_COUNT;

      imgElements.forEach((img, index) => {
        ctx.drawImage(
          img,
          edgePadding,
          startY + index * (singleImageHeight + imageGap),
          finalWidth - edgePadding * 2,
          singleImageHeight
        );
      });

      const finalImage = canvas.toDataURL('image/png');
      setMergedImage(finalImage);
    };

    mergeImages();
  }, [photos, navigate, backgroundColor]);

  const downloadImage = () => {
    if (!mergedImage) return;
    const link = document.createElement('a');
    link.href = mergedImage;
    link.download = 'photo-strip.png';
    link.click();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex gap-12">
        {/* Left side - Photo strip */}
        {mergedImage && (
          <div className="h-[80vh]">
            <img
              src={mergedImage}
              alt="Photo Strip"
              className="h-full w-auto border rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Right side - Controls */}
        <div className="flex flex-col justify-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setBackgroundColor('#FFFFFF')}
              className="px-4 py-2 border rounded-lg bg-white"
              title="White"
            >
              White
            </button>
            <button
              onClick={() => setBackgroundColor('#000000')}
              className="px-4 py-2 border rounded-lg bg-black text-white"
              title="Black"
            >
              Black
            </button>
            <button
              onClick={() => setBackgroundColor('#FFE4E1')}
              className="px-4 py-2 border rounded-lg"
              style={{ backgroundColor: '#FFE4E1' }}
              title="Light Pink"
            >
              Pink
            </button>
          </div>

          <button
            onClick={downloadImage}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg"
          >
            Download Photo Strip
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg"
          >
            Retake Photos
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PhotoResult;
