'use client';

import { Card } from '@/components/ui/card';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PrayerTime {
  fajr: string;
  shurooq: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface Props {
  prayerTimes: PrayerTime;
}

export default function PrayerTimesDisplay({ prayerTimes }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const prayerTimesList = [
    { name: 'Fajr', time: prayerTimes.fajr, icon: Moon },
    { name: 'Sunrise', time: prayerTimes.shurooq, icon: Sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, icon: Sun },
    { name: 'Asr', time: prayerTimes.asr, icon: Sun },
    { name: 'Maghrib', time: prayerTimes.maghrib, icon: Sunset },
    { name: 'Isha', time: prayerTimes.isha, icon: Moon },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Prayer Times</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prayerTimesList.map(({ name, time, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-medium">{name}</span>
            </div>
            <span className="text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}