import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PhotoResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const photos: string[] = location.state?.photos || [];

  useEffect(() => {
    if (photos.length !== 3) {
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
      const edgePadding = 40;
      const imageGap = 20;
      const singleImageHeight =
        (finalHeight - edgePadding * 2 - imageGap * 2) / 3;

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

      imgElements.forEach((img, index) => {
        ctx.drawImage(
          img,
          edgePadding,
          edgePadding + index * (singleImageHeight + imageGap),
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Your Photo Strip</h1>
      <div className="mb-4 flex gap-2">
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {mergedImage && (
        <div className="max-h-[80vh] overflow-auto">
          <img
            src={mergedImage}
            alt="Photo Strip"
            className="border rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      )}
      <button
        onClick={downloadImage}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg"
      >
        Download Photo Strip
      </button>
      <button
        onClick={() => navigate('/')}
        className="mt-2 px-6 py-2 bg-gray-600 text-white font-bold rounded-lg"
      >
        Retake Photos
      </button>
    </div>
  );
};

export default PhotoResult;
