import { LucideTrash, LucideUpload, LucideUser } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export type ImageValue = string | File | null;

type Props = {
  image: ImageValue;
  onChange: (image: ImageValue) => void;
  isEditting?: boolean;
};

const ProfilePhotoSelector: React.FC<Props> = ({ image, onChange, isEditting = true }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    if (typeof image === 'string') {
      setPreviewUrl(image);
      return;
    }

    const preview = URL.createObjectURL(image);
    setPreviewUrl(preview);

    return () => URL.revokeObjectURL(preview);
  }, [image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="mb-6 flex justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="bg-base-300 relative flex size-20 items-center justify-center rounded-full">
          <LucideUser className="text-base-content size-9" />
          <button
            type="button"
            title="Upload profile photo"
            className="bg-success absolute -right-1 -bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={() => inputRef.current?.click()}
          >
            <LucideUpload size={18} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} className="size-20 rounded-full object-cover" />
          {isEditting && (
            <button
              type="button"
              title="Remove profile photo"
              className="bg-error absolute -right-1 -bottom-1 flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
              onClick={handleRemove}
            >
              <LucideTrash size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
