import React, { createContext, useContext, useState } from 'react';

interface PhotoBoothContextType {
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
  selectedCamera: string;
  setSelectedCamera: (deviceId: string) => void;
}

const PhotoBoothContext = createContext<PhotoBoothContextType | null>(null);

export const PhotoBoothProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  return (
    <PhotoBoothContext.Provider
      value={{
        photos,
        setPhotos,
        stream,
        setStream,
        selectedCamera,
        setSelectedCamera,
      }}
    >
      {children}
    </PhotoBoothContext.Provider>
  );
};

export const usePhotoBoothContext = () => {
  const context = useContext(PhotoBoothContext);
  if (!context) {
    throw new Error(
      'usePhotoBoothContext must be used within a PhotoBoothProvider'
    );
  }
  return context;
};
