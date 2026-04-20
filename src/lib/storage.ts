import { supabase } from './supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadBookFile(file: File, userId: string) {
  // Step 5: Client-side size check
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Math.random()}.${fileExt}`;
  const filePath = `books/${fileName}`;

  const { data, error } = await supabase.storage
    .from('books')
    .upload(filePath, file);

  if (error) throw error;
  
  // Return the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('books')
    .getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
}
