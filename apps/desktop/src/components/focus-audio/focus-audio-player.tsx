import { ChevronUp, Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Slider } from '@repo/ui/components/ui/slider';

import { useFocusAudio } from '../../hooks/use-focus-audio';

import { FocusAudioSelector } from './focus-audio-selector';

export function FocusAudioPlayer() {
  const { sound, isPlaying, volume, play, pause, stop, setVolume } =
    useFocusAudio();

  const hasSound = sound.id !== 'none';

  const volumePercent = Math.round(volume * 100);

  function handleVolumeChange(value: number[]) {
    const nextVolume = value[0] ?? 0;

    setVolume(nextVolume / 100);
  }

  return (
    <div className='space-y-3'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            className='h-auto w-full justify-start gap-3 px-2 py-2'
          >
            <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <Volume2 className='size-4' />
            </div>

            <div className='min-w-0 flex-1 text-left'>
              <p className='truncate text-sm font-medium'>{sound.name}</p>

              <p className='text-muted-foreground truncate text-xs'>
                {hasSound ? sound.description : 'Choose a focus sound'}
              </p>
            </div>

            <ChevronUp className='text-muted-foreground size-4 shrink-0' />
          </Button>
        </PopoverTrigger>

        <PopoverContent side='top' align='start' className='w-80 p-2'>
          <div className='px-2 py-2'>
            <p className='text-sm font-medium'>Focus sound</p>

            <p className='text-muted-foreground mt-1 text-xs'>
              Choose a sound for your focus session.
            </p>
          </div>

          <FocusAudioSelector />
        </PopoverContent>
      </Popover>

      {hasSound && (
        <>
          <div className='flex items-center gap-1'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='size-8'
              onClick={isPlaying ? pause : play}
              aria-label={isPlaying ? 'Pause focus audio' : 'Play focus audio'}
            >
              {isPlaying ? (
                <Pause className='size-3.5' />
              ) : (
                <Play className='size-3.5' />
              )}
            </Button>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8'
              onClick={stop}
              disabled={!isPlaying}
              aria-label='Stop focus audio'
            >
              <Square className='size-3.5' />
            </Button>

            <div className='ml-1 flex min-w-0 flex-1 items-center gap-2'>
              {volume === 0 ? (
                <VolumeX className='text-muted-foreground size-3.5 shrink-0' />
              ) : (
                <Volume2 className='text-muted-foreground size-3.5 shrink-0' />
              )}

              <Slider
                value={[volumePercent]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                aria-label='Focus audio volume'
              />
            </div>
          </div>

          <p className='text-muted-foreground text-right text-[11px]'>
            {volumePercent}%
          </p>
        </>
      )}
    </div>
  );
}
