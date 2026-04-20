"use server";

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Step 10 Task 1: NCERT Scraper / Ingestor
 * Uses Open Library to fetch metadata and links to ePathshala
 */
export async function fetchNcertBooks(subject: string, grade: string) {
  try {
    const query = `NCERT ${subject} ${grade}`;
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
        },
      }
    );

    const booksToInsert = data.docs.slice(0, 5).map((doc: any) => ({
      title: doc.title,
      author: doc.author_name?.[0] || 'NCERT',
      publisher_name: 'NCERT',
      grade_level: grade,
      academic_category: subject,
      is_study_book: true,
      // Mocking the ePathshala URL pattern
      content_text: `Official NCERT text for ${doc.title}. View online: https://epathshala.nic.in/QR/?id=${doc.edition_key?.[0] || 'default'}`
    }));

    const { data: inserted, error } = await supabase.from('books').upsert(booksToInsert, { onConflict: 'title' });
    
    if (error) throw error;
    return { success: true, count: booksToInsert.length };
  } catch (err: any) {
    console.error("NCERT Fetch Error:", err.message);
    return { success: false, error: err.message };
  }
}
