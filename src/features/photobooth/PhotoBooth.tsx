import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoBooth: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (photos.length === 3) {
      setTimeout(() => {
        navigate('/result', { state: { photos } });
      }, 1000);
    }
  }, [photos, navigate]);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { exact: 16 / 9 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();
        if (capabilities.width && capabilities.height) {
          const settings = {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            aspectRatio: { exact: 16 / 9 },
          };
          await videoTrack.applyConstraints(settings);
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  useEffect(() => {
    getCameras();
    navigator.mediaDevices.addEventListener('devicechange', getCameras);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getCameras);
    };
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      startCamera(selectedCamera);
    }
  }, [selectedCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    // Set canvas size to match video dimensions
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    // Draw the video frame onto the canvas
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageData = canvasRef.current.toDataURL('image/png');
    setPhotos((prev) => {
      const newPhotos = prev.length < 4 ? [...prev, imageData] : prev;
      return newPhotos;
    });
  };

  const startPhotoSequence = () => {
    setIsProcessing(true);
    let photosRemaining = 3;
    let currentCountdown = 1;

    const takePhoto = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);

      capturePhoto();
      photosRemaining--;

      if (photosRemaining > 0) {
        setTimeout(() => {
          currentCountdown = 1;
          setCountdown(currentCountdown);

          const countdownInterval = setInterval(() => {
            currentCountdown--;
            setCountdown(currentCountdown);

            if (currentCountdown === 0) {
              clearInterval(countdownInterval);
              setTimeout(takePhoto, 100);
            }
          }, 1000);
        }, 1000);
      } else {
        setIsProcessing(false);
        setCountdown(null);
      }
    };

    setCountdown(currentCountdown);
    const initialCountdownInterval = setInterval(() => {
      currentCountdown--;
      setCountdown(currentCountdown);

      if (currentCountdown === 0) {
        clearInterval(initialCountdownInterval);
        setTimeout(takePhoto, 100);
      }
    }, 1000);
  };

  return (
    <div className="flex h-screen w-screen p-8 gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative h-[70vh] flex flex-col justify-center items-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
          {isFlashing && (
            <div className="absolute inset-0 bg-white opacity-50 animate-flash" />
          )}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-9xl font-bold drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
          <button
            onClick={isProcessing ? undefined : startPhotoSequence}
            disabled={isProcessing}
            className={`absolute right-8 w-18 h-18 bg-transparent border-4 border-white rounded-full flex justify-center items-center ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="absolute w-14 h-14 bg-white rounded-full" />
          </button>
        </div>
        <div className="flex-grow">
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="z-10 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2"
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side - Captured photos */}
      <div className="w-1/4 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full aspect-video grid grid-rows-4 gap-1">
          {photos.map((src, index) => (
            <img
              key={index}
              src={src}
              className="w-full h-full object-cover rounded-lg"
              alt="Captured"
            />
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PhotoBooth;
