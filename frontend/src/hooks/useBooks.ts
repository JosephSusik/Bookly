// src/hooks/useBooks.ts
import { useQuery } from '@tanstack/react-query';
import { Book } from '@/components/general/datagrid/columns/Book';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


async function fetchBooks(): Promise<Book[]> {
    const res = await fetch(`${API_URL}/books/all`);    
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
}

export function useBooks() {
  return useQuery<Book[], Error>({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });
}
