import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Voice Settings
  voiceSpeed: number;
  voicePitch: number;
  selectedVoiceName: string | null;
  
  // Model Settings
  preferredModelId: string;
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setVoiceSpeed: (speed: number) => void;
  setVoicePitch: (pitch: number) => void;
  setSelectedVoiceName: (name: string | null) => void;
  setPreferredModelId: (id: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      selectedVoiceName: null,
      preferredModelId: 'cerebras-llama-3.1-70b',
      theme: 'dark',

      setVoiceSpeed: (voiceSpeed) => set({ voiceSpeed }),
      setVoicePitch: (voicePitch) => set({ voicePitch }),
      setSelectedVoiceName: (selectedVoiceName) => set({ selectedVoiceName }),
      setPreferredModelId: (preferredModelId) => set({ preferredModelId }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'better-kindle-settings',
    }
  )
);
