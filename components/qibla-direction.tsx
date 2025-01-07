import { Card } from '@/components/ui/card';
import { Compass } from 'lucide-react';
import Image from 'next/image';

interface Props {
  direction: string;
  mapImage: string;
}

export default function QiblaDirection({ direction, mapImage }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Qibla Direction</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <span>{direction}° from North</span>
        </div>
        {/* <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={mapImage}
            alt="Location Map"
            fill
            className="object-cover"
          />
        </div> */}
      </div>
    </Card>
  );
}