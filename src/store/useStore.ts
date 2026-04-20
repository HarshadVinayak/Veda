import { create } from 'zustand';
import { UserTier, Book, Highlight } from '@/types/database';

interface UserState {
  tier: UserTier;
  id: string | null;
  email: string | null;
  isLoggedIn: boolean;
  studyMode: boolean;
  readerMode: boolean;
  setProfile: (profile: Partial<UserState>) => void;
  toggleStudyMode: () => void;
  toggleReaderMode: () => void;
}

interface BookState {
  activeBook: Book | null;
  currentPage: number;
  highlights: Highlight[];
  setActiveBook: (book: Book | null) => void;
  setCurrentPage: (page: number) => void;
  setHighlights: (highlights: Highlight[]) => void;
  addHighlight: (highlight: Highlight) => void;
}

export const useUserStore = create<UserState>((set) => ({
  tier: 'FREE',
  id: null,
  email: null,
  isLoggedIn: false,
  studyMode: false,
  readerMode: true,
  setProfile: (profile) => set((state) => ({ ...state, ...profile })),
  toggleStudyMode: () => set((state) => ({ studyMode: !state.studyMode })),
  toggleReaderMode: () => set((state) => ({ readerMode: !state.readerMode })),
}));

export const useBookStore = create<BookState>((set) => ({
  activeBook: null,
  currentPage: 0,
  highlights: [],
  setActiveBook: (book) => set({ activeBook: book }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setHighlights: (highlights) => set({ highlights }),
  addHighlight: (highlight) => set((state) => ({ highlights: [...state.highlights, highlight] })),
}));
