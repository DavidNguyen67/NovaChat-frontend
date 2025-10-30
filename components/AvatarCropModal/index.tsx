/* eslint-disable prettier/prettier */
'use client';

import React, { useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';

import { getCroppedImg } from './config';

interface AvatarCropModalProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onCropDone: (croppedImage: string) => void; // ✅ trả về ảnh base64
}

const AvatarCropModal = ({
  imageSrc,
  open,
  onClose,
  onCropDone,
}: AvatarCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropDone = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    onCropDone(croppedImage);
    onClose();
  };

  useEffect(() => {
    return () => {
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    };
  }, [open]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="bg-[#1e1f22] text-white border border-[#2a2b2e]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-lg font-semibold text-center">
              Crop your avatar
            </ModalHeader>

            <ModalBody className="flex flex-col gap-4 items-center justify-center">
              <div className="relative size-[400px] rounded-full overflow-hidden">
                <Cropper
                  aspect={1}
                  crop={crop}
                  cropShape="round"
                  image={imageSrc}
                  showGrid={false}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <input
                className="w-full accent-primary transition-all"
                max={4}
                min={1}
                step={0.1}
                type="range"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleCropDone}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AvatarCropModal;
