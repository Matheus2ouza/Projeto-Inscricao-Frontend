'use client';

import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { Image } from 'antd';

interface EventImageProps {
  image?: string;
  name: string;
}

export default function EventImage({ image, name }: EventImageProps) {
  const gradientClass = getGradientClass(name);

  return (
    <div className="relative h-62 w-full overflow-hidden rounded-t-lg">
      {image ? (
        <Image
          src={image}
          alt={name}
          preview={false}
          className="h-full w-full object-cover"
          fallback="" // evita quebrar se a imagem falhar
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-end justify-start p-4`}
        >
          <span className="text-left text-lg font-bold text-white uppercase">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
