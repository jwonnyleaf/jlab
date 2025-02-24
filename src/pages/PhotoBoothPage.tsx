import React from 'react';
import { PhotoBooth } from '../features/photobooth';

const PhotoBoothPage: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <PhotoBooth />
    </div>
  );
};

export default PhotoBoothPage;
