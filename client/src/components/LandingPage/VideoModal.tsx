import { useEffect, useRef } from 'react';
import demoVideo from '@/assets/video/demo.mp4';
import VideoPoster from '@/assets/poster.jpg';
import { X } from 'lucide-react';

const VideoModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Pause video when closing
  const closeModal = () => {
    if (videoRef.current) videoRef.current.pause();
    setOpen(false);
  };

  // Close when clicking outside video container
  const backdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <>
      {/* MODAL */}
      {open && (
        <div
          onClick={backdropClick}
          className="animate-fadeIn fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="animate-scaleIn relative w-full max-w-3xl transform rounded-xl bg-white/50 p-2">
            <p className="mt-1.5 mb-4 text-left text-2xl font-medium text-black">Demo Video</p>
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 rounded-full bg-white p-2 text-black shadow transition hover:bg-neutral-200"
            >
              <X size={20} />
            </button>

            {/* VIDEO */}
            <video
              ref={videoRef}
              src={demoVideo}
              poster={VideoPoster}
              controls
              className="max-h-[110vh] w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VideoModal;
