'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import PrayerTimesDisplay from '@/components/prayer-times-display';
import WeatherCard from '@/components/weather-card';
import QiblaDirection from '@/components/qibla-direction';
import { Clock, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for react-toastify

// Define the shape of the `prayerData`
interface PrayerData {
  items: {
    date_for: string;
    fajr: string;
    shurooq: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }[];
  city: string;
  state: string;
  country: string;
  qibla_direction: string;
  map_image: string;
  today_weather: {
    temperature: string;
    pressure: string;
  };
}

// Define the search schema for the form
const searchSchema = z.object({
  city: z.string().min(2, 'City name must be at least 2 characters'),
});

export default function Home() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      city: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: { city: string }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nexoracle.com/islamic/prayer-times?city=${data.city}&apikey=4aeb57e3ed0f238762`
      );
      const result = await response.json();

      // Log the response for debugging
      console.log('API Response:', result);

      if (result.status === 200) {
        if (result.result.status_valid === 1) {
          const prayerData: PrayerData = {
            items: result.result.items,
            city: result.result.city,
            state: result.result.state,
            country: result.result.country,
            qibla_direction: result.result.qibla_direction,
            map_image: result.result.map_image,
            today_weather: result.result.today_weather,
          };

          setPrayerData(prayerData);
          toast.success(`Prayer times loaded for ${prayerData.city || prayerData.state}`);
        } else if (result.result.status_valid === 0) {
          // Log the invalid query error for debugging
          console.log('Invalid Query Error:', result.result.status_error?.invalid_query);

          toast.error(result.result.status_error?.invalid_query || 'Invalid location. Please try again.');
        }
      } else {
        throw new Error('Failed to fetch prayer times.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);

      toast.error('Failed to fetch prayer times. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.header
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Prayer Times</h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter city name..."
                {...form.register('city')}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.city && (
              <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
            )}
          </form>
        </motion.header>

        {/* Ensure ToastContainer is placed here */}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />

        <AnimatePresence>
          {prayerData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <p className="text-center text-muted-foreground">
                {prayerData.city || prayerData.state}, {prayerData.country}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <PrayerTimesDisplay prayerTimes={prayerData.items[0]} />
                </motion.div>
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <WeatherCard weather={prayerData.today_weather} />
                  <QiblaDirection
                    direction={prayerData.qibla_direction}
                    mapImage={prayerData.map_image}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
