export type FocusSoundId =
  'none' | 'rain' | 'thunder-rain' | 'rain-thunder' | 'lofi-relaxation';

export type FocusSound = {
  id: FocusSoundId;
  name: string;
  description: string;
  src?: string;
};

export type FocusAudioState = {
  soundId: FocusSoundId;
  isPlaying: boolean;
  volume: number;
};
