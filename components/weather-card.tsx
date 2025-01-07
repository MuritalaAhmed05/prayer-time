import { Card } from '@/components/ui/card';
import { Thermometer, Gauge } from 'lucide-react';

interface Props {
  weather: {
    temperature: string;
    pressure: string;
  };
}

export default function WeatherCard({ weather }: Props) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Weather</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span>Temperature</span>
          </div>
          <span className="text-lg font-medium">{weather.temperature}°C</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span>Pressure</span>
          </div>
          <span className="text-lg font-medium">{weather.pressure} hPa</span>
        </div>
      </div>
    </Card>
  );
}