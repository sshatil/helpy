import { FocusSound, FocusSoundId } from './audio-types';

export const FOCUS_SOUNDS: FocusSound[] = [
  {
    id: 'none',
    name: 'None',
    description: 'No background sound.',
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Soft rainfall for a calm focus session.',
    src: '/sounds/light-rain.wav',
  },
  {
    id: 'thunder-rain',
    name: 'Rain with thunder',
    description: 'Soft thunder rainfall for a calm focus session.',
    src: '/sounds/rain-and-thunder.wav',
  },
];

export function getFocusSound(soundId: FocusSoundId): FocusSound {
  return FOCUS_SOUNDS.find((sound) => sound.id === soundId) ?? FOCUS_SOUNDS[0];
}
