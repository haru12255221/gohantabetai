'use client';

import { useState } from 'react';
import { Shop } from '@/types/shop';
import useLikes from '@/hooks/useLikes';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/navigation';

interface LikesPageClientProps {
  allShops: Shop[];
}

export default function LikesPageClient({ allShops }: LikesPageClientProps) {
  const { likedShopIds } = useLikes();
  const router = useRouter();

  const likedShops = allShops.filter(shop => shop && likedShopIds.includes(shop.id));

  const handleCardClick = (shopId: string) => {
    router.push(`/shop/${shopId}`);
  };

  if (likedShops.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">No liked shops yet.</div>;
  }

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {likedShops.map(shop => (
        <Card key={shop.id} shopId={shop.id} variant="list" onClick={() => handleCardClick(shop.id)}>
          <img src={shop.imageUrl || '/images/fallback.jpg'} alt={shop.name} className="w-full h-32 object-cover rounded-t-lg" />
          <div className="p-2">
            <h3 className="font-bold text-lg">{shop.name}</h3>
            <p className="text-sm text-gray-600">{shop.genre}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
