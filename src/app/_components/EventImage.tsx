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
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
      {image ? (
        <Image
          src={image}
          alt={name}
          preview={false}
          width="100%"
          height="100%"
          className="object-cover"
          fallback="/images/fallback/not-found-01.png"
          placeholder={
            <Image
              preview={false}
              src={`${image}&width=40&quality=10`}
              className="scale-110 object-cover blur-md"
            />
          }
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
