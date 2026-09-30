import { getFocusSound } from './audio-registry';

import type { FocusAudioState, FocusSoundId } from './audio-types';

type Listener = () => void;

const DEFAULT_VOLUME = 0.5;

let audio: HTMLAudioElement | undefined;

let state: FocusAudioState = {
  soundId: 'none',
  isPlaying: false,
  volume: DEFAULT_VOLUME,
};

let snapshot: FocusAudioState = {
  ...state,
};

const listeners = new Set<Listener>();

function updateSnapshot() {
  snapshot = {
    ...state,
  };
}

function emit() {
  updateSnapshot();

  listeners.forEach((listener) => {
    listener();
  });
}

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';

    audio.addEventListener('play', handlePlay);

    audio.addEventListener('pause', handlePause);

    audio.addEventListener('ended', handleEnded);

    audio.addEventListener('error', handleError);
  }

  return audio;
}

function handlePlay() {
  if (!state.isPlaying) {
    state = {
      ...state,
      isPlaying: true,
    };

    emit();
  }
}

function handlePause() {
  if (state.isPlaying) {
    state = {
      ...state,
      isPlaying: false,
    };

    emit();
  }
}

function handleEnded() {
  const currentAudio = audio;

  if (!currentAudio) {
    return;
  }

  currentAudio.currentTime = 0;

  if (state.soundId !== 'none') {
    void currentAudio.play();
  }
}

function handleError(event: Event) {
  console.error('Focus audio playback failed:', event);

  state = {
    ...state,
    isPlaying: false,
  };

  emit();
}

function setAudioSource(soundId: FocusSoundId) {
  const sound = getFocusSound(soundId);

  const currentAudio = getAudio();

  currentAudio.pause();
  currentAudio.currentTime = 0;

  if (!sound.src) {
    currentAudio.removeAttribute('src');
    currentAudio.load();
    return;
  }

  currentAudio.src = sound.src;
  currentAudio.loop = true;
  currentAudio.volume = state.volume;
  currentAudio.load();
}

function setSound(soundId: FocusSoundId) {
  if (state.soundId === soundId) {
    return;
  }

  const shouldResume = state.isPlaying;

  setAudioSource(soundId);

  state = {
    ...state,
    soundId,
    isPlaying: false,
  };

  emit();

  if (shouldResume && soundId !== 'none') {
    void play();
  }
}

async function play() {
  if (state.soundId === 'none') {
    return;
  }

  const currentAudio = getAudio();

  try {
    await currentAudio.play();

    state = {
      ...state,
      isPlaying: true,
    };

    emit();
  } catch (error) {
    console.error('Failed to play focus audio:', error);

    state = {
      ...state,
      isPlaying: false,
    };

    emit();
  }
}

function pause() {
  const currentAudio = audio;

  if (!currentAudio) {
    return;
  }

  currentAudio.pause();

  state = {
    ...state,
    isPlaying: false,
  };

  emit();
}

function stop() {
  const currentAudio = audio;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  state = {
    ...state,
    isPlaying: false,
  };

  emit();
}

function setVolume(volume: number) {
  const nextVolume = Math.min(1, Math.max(0, volume));

  const currentAudio = audio;

  if (currentAudio) {
    currentAudio.volume = nextVolume;
  }

  state = {
    ...state,
    volume: nextVolume,
  };

  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function initialize() {
  const currentAudio = getAudio();

  currentAudio.volume = state.volume;
}

initialize();

export const focusAudioStore = {
  subscribe,
  getSnapshot,
  setSound,
  play,
  pause,
  stop,
  setVolume,
};
