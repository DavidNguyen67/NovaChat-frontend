/* eslint-disable prettier/prettier */
import React from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { OverlayRenderProps } from 'react-photo-view/dist/types';

const PhotoOverlay = (overlayProps: OverlayRenderProps) => {
  return (
    <div className="absolute top-3 left-0 right-0 flex justify-between items-center px-4 z-50 select-none">
      <div className="flex gap-2 items-center justify-end w-full">
        <div className="bg-background/60 backdrop-blur-md px-2 py-1 rounded-xl shadow-sm">
          <Button
            isIconOnly
            aria-label="Download"
            color="primary"
            size="sm"
            variant="light"
            onPress={() => {
              const img = overlayProps.images[overlayProps.index].src;
              const a = document.createElement('a');

              a.href = img!;
              a.download = img!.split('/').pop() || 'image.jpg';
              a.rel = 'noreferrer';
              a.target = '_blank';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            <Icon className="text-xl" icon="mdi:download" />
          </Button>

          <Button
            isIconOnly
            aria-label="Close"
            color="danger"
            size="sm"
            variant="light"
            onPress={() => overlayProps.onClose()}
          >
            <Icon className="text-xl" icon="mdi:close" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoOverlay;
