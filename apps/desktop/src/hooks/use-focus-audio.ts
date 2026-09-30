import { useCallback, useSyncExternalStore } from 'react';

import { focusAudioStore } from '../lib/focus-audio/audio-store';

import { getFocusSound } from '../lib/focus-audio/audio-registry';

export function useFocusAudio() {
  const state = useSyncExternalStore(
    focusAudioStore.subscribe,
    focusAudioStore.getSnapshot,
    focusAudioStore.getSnapshot,
  );

  const setSound = useCallback((soundId: typeof state.soundId) => {
    focusAudioStore.setSound(soundId);
  }, []);

  const play = useCallback(() => {
    void focusAudioStore.play();
  }, []);

  const pause = useCallback(() => {
    focusAudioStore.pause();
  }, []);

  const stop = useCallback(() => {
    focusAudioStore.stop();
  }, []);

  const setVolume = useCallback((volume: number) => {
    focusAudioStore.setVolume(volume);
  }, []);

  return {
    ...state,

    sound: getFocusSound(state.soundId),

    setSound,
    play,
    pause,
    stop,
    setVolume,
  };
}
