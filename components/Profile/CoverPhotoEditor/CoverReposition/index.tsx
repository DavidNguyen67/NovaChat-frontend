/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import Draggable, { DraggableBounds } from 'react-draggable';
import { Button, Image } from '@heroui/react';

interface CoverRepositionProps {
  avatarPreview: string;
  onSave: (offsetY: number) => void;
  onCancel: () => void;
}

const CoverReposition = ({
  avatarPreview,
  onSave,
  onCancel,
}: CoverRepositionProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const [offsetY, setOffsetY] = useState<number>(0);

  const [bounds, setBounds] = useState<DraggableBounds>({ top: 0, bottom: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcBounds = () => {
      const img = imgRef.current;
      const container = containerRef.current;

      if (!img || !container) return;

      const containerHeight = container.clientHeight;
      const imgDisplayWidth = img.clientWidth;
      const imageHeight =
        img.naturalHeight * (imgDisplayWidth / img.naturalWidth);

      console.log('[CoverReposition] Check clientHeight:', {
        containerHeight,
        imgDisplayWidth,
        imgNaturalHeight: img.naturalHeight,
        imgNaturalWidth: img.naturalWidth,
        imageHeight,
      });

      if (imageHeight > containerHeight) {
        const topBound = containerHeight - imageHeight;

        setBounds({ top: topBound, bottom: 0 });
      } else {
        setBounds({ top: 0, bottom: 0 });
      }
    };

    setOffsetY(0);

    const img = imgRef.current;

    if (img?.complete) calcBounds();
    else img?.addEventListener('load', calcBounds);

    return () => img?.removeEventListener('load', calcBounds);
  }, [avatarPreview]);

  console.log('[CoverReposition] Check bounds', bounds);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] overflow-hidden cursor-grab select-none active:cursor-grabbing"
    >
      <Draggable
        axis="y"
        bounds={bounds}
        nodeRef={imgRef}
        position={{ x: 0, y: offsetY }}
        onStop={(_, data) => setOffsetY(data.y)}
      >
        <Image
          ref={imgRef}
          alt="cover"
          className="absolute w-full object-cover rounded-b-2xl shadow-sm"
          classNames={{
            wrapper: '!max-w-full w-full !h-full !max-h-full',
            img: '!h-full !max-h-full',
          }}
          draggable={false}
          src={avatarPreview!}
        />
      </Draggable>

      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        <Button color="default" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={() => {
            onSave(offsetY);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CoverReposition;
