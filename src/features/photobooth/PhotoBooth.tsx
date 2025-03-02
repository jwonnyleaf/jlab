import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBoothContext } from '../../contexts/PhotoBoothContext';
import { PHOTO_COUNT, PHOTO_INTERVAL } from '../../config/PhotoBoothConfig';

const PhotoBooth: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    photos,
    setPhotos,
    stream,
    setStream,
    selectedCamera,
    setSelectedCamera,
  } = usePhotoBoothContext();

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    audioRef.current = new Audio('/src/assets/sounds/effects/shutter.mp3');
  }, []);

  useEffect(() => {
    if (photos.length === PHOTO_COUNT) {
      setTimeout(() => {
        navigate('/result', { state: { photos } });
      }, 1000);
    }
  }, [photos, navigate]);

  useEffect(() => {
    requestCameraPermission().then((granted) => {
      if (granted) {
        getCameras();
        navigator.mediaDevices.addEventListener('devicechange', getCameras);
        if (selectedCamera) {
          startCamera(selectedCamera);
        }
      }
    });

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getCameras);
    };
  }, [selectedCamera]);

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

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
          aspectRatio: 16 / 9,
        },
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageData = canvasRef.current.toDataURL('image/png');
    setPhotos((prev) => {
      const newPhotos = prev.length < PHOTO_COUNT ? [...prev, imageData] : prev;
      return newPhotos;
    });
  };

  const startPhotoSequence = () => {
    setIsProcessing(true);
    let photosRemaining = PHOTO_COUNT;
    let currentCountdown = PHOTO_INTERVAL;

    const takePhoto = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 200);

      audioRef.current?.play();
      capturePhoto();
      photosRemaining--;

      if (photosRemaining > 0) {
        setTimeout(() => {
          currentCountdown = PHOTO_INTERVAL;
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

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="flex h-full w-full gap-1">
      <div className="relative flex w-full h-full flex-col gap-1">
        <div className="relative min-h-[75vh] max-h-[75vh] flex flex-col rounded-xl bg-dark-neutral justify-center items-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover rounded-xl shadow-lg transform scale-x-[-1]"
          />
          {isFlashing && (
            <div className="absolute inset-0 bg-white opacity-75 animate-flash rounded-xl" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-[clamp(4rem,12vw,12rem)] font-bold drop-shadow-lg">
                {countdown}
              </span>
            </div>
          )}
          <div className="absolute bottom-1 left-1 right-1 h-12 bg-black/50 p-2 flex justify-between items-center rounded-xl">
            <select
              value={selectedCamera}
              onChange={(e) => {
                const newDeviceID = e.target.value;
                setSelectedCamera(newDeviceID);
              }}
              className="text-white p-2"
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={isProcessing ? undefined : startPhotoSequence}
            disabled={isProcessing}
            className={`absolute right-8 w-[clamp(3rem,4vw,4.5rem)] h-[clamp(3rem,4vw,4.5rem)] bg-transparent border-4 border-white rounded-full flex justify-center items-center ${
              isProcessing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 transition-transform'
            }`}
          >
            <div className="absolute w-[80%] h-[80%] bg-white rounded-full" />
          </button>
        </div>
        <div className="w-full h-full flex gap-2 bg-dark-neutral p-1 rounded-xl overflow-hidden">
          {Array(PHOTO_COUNT)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`flex-1 min-w-0 h-full rounded-lg shadow-md ${
                  !photos[index] ? 'bg-gray opacity-50' : ''
                }`}
              >
                {photos[index] && (
                  <img
                    src={photos[index]}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Captured"
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="relative w-1/3 flex flex-col justify-center items-center overflow-hidden bg-neutral rounded-xl p-4"></div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PhotoBooth;
