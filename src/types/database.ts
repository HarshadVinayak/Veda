// ──────────────────────────────────────────────
// Better Kindle — Database Types
// ──────────────────────────────────────────────

/** The four subscription tiers in Veda */
export type UserTier = 'FREE_LISTENER' | 'STUDENT' | 'ADULT' | 'ROOT_USER';

/** Row from the `profiles` table */
export interface Profile {
  id: string;                    // uuid — references auth.users
  username: string | null;       // display name
  avatar_url: string | null;     // Google profile picture
  tier: UserTier;
  email?: string | null;         // For security checks
  isAdmin?: boolean;             // Derived flag for UI
  created_at: string;            // timestamptz
}

/** Row from the `books` table */
export interface Book {
  id: string;                    // uuid
  title: string;
  author: string;
  content_text: string;
  is_study_book: boolean;
  uploaded_by_user_id: string | null;  // null = uploaded by SUPER / system
  created_at: string;
}

/** Row from the `highlights` table */
export interface Highlight {
  id: string;                    // uuid
  user_id: string;
  book_id: string;
  highlighted_text: string;
  page_number: number;
  line_index: number;
  created_at: string;
  /** Joined book data (only present when using select with join) */
  books?: Pick<Book, 'title'>;
}

/** Payload for uploading a new book (user‑supplied fields only) */
export interface UserUpload {
  title: string;
  author: string;
  content_text: string;
  is_study_book: boolean;
  uploaded_by_user_id: string;   // must match auth.uid()
}

// ──────────────────────────────────────────────
// Insert payloads (what you send to .insert())
// ──────────────────────────────────────────────

export interface HighlightInsert {
  user_id: string;
  book_id: string;
  highlighted_text: string;
  page_number: number;
  line_index: number;
}

export interface ProfileInsert {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  tier?: UserTier;
}

export interface BookInsert {
  title: string;
  author: string;
  content_text: string;
  is_study_book?: boolean;
  uploaded_by_user_id?: string | null;
}

// ──────────────────────────────────────────────
// Supabase‑generated‑style database schema type
// Use with  createClient<Database>()
// ──────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
        Relationships: [];
      };
      books: {
        Row: Book;
        Insert: BookInsert;
        Update: Partial<BookInsert>;
        Relationships: [
          {
            foreignKeyName: 'books_uploaded_by_user_id_fkey';
            columns: ['uploaded_by_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      highlights: {
        Row: Omit<Highlight, 'books'>;
        Insert: HighlightInsert;
        Update: Partial<HighlightInsert>;
        Relationships: [
          {
            foreignKeyName: 'highlights_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'highlights_book_id_fkey';
            columns: ['book_id'];
            isOneToOne: false;
            referencedRelation: 'books';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_tier: UserTier;
    };
    CompositeTypes: Record<string, never>;
  };
}
