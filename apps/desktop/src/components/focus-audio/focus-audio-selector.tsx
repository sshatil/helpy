import { Check, Music2 } from 'lucide-react';

import { Button } from '@repo/ui/components/ui/button';

import { FOCUS_SOUNDS } from '../../lib/focus-audio/audio-registry';

import { useFocusAudio } from '../../hooks/use-focus-audio';

export function FocusAudioSelector() {
  const { soundId, setSound } = useFocusAudio();

  return (
    <div className='space-y-1'>
      {FOCUS_SOUNDS.map((sound) => {
        const isSelected = sound.id === soundId;

        return (
          <Button
            key={sound.id}
            type='button'
            variant={isSelected ? 'secondary' : 'ghost'}
            className='h-auto w-full justify-start gap-3 px-3 py-2.5'
            onClick={() => setSound(sound.id)}
          >
            <div className='bg-muted flex size-8 shrink-0 items-center justify-center rounded-md'>
              <Music2 className='size-3.5' />
            </div>

            <div className='min-w-0 flex-1 text-left'>
              <p className='text-sm font-medium'>{sound.name}</p>

              <p className='text-muted-foreground truncate text-xs'>
                {sound.description}
              </p>
            </div>

            {isSelected && <Check className='size-4 shrink-0' />}
          </Button>
        );
      })}
    </div>
  );
}
