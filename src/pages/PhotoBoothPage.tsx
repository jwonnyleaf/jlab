import React from 'react';
import { PhotoBooth } from '../features/photobooth';

const PhotoBoothPage: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full h-full">
        <PhotoBooth />
      </div>
    </div>
  );
};

export default PhotoBoothPage;
