import { Book } from "@/components/general/datagrid/columns/Book";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json(); // { token, user, message }
}

export async function fetchUsers(token?: string) {
  const res = await fetch(`${API_URL}/users`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export interface SearchByISBNResponse {
  source: "database" | "google_books" | "manual";
  book: {
    ISBN?: string;
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    published_date?: string | Date;
    page_count?: number;
    language?: string;
    description?: string;
    cover_url?: string;
  };
  disabledFields: string[];
}

export async function searchBookByISBN(ISBN: string, token: string): Promise<SearchByISBNResponse> {
  const res = await fetch(`${API_URL}/books/search-by-isbn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ISBN }),
  });

  if (!res.ok) {
    let errorMessage = "Failed to search for book";
    try {
      const error = await res.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export interface CreateBookData {
  ISBN?: string;
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  published_date?: Date | string;
  page_count?: number;
  language?: string;
  description?: string;
  cover_url?: string;
}

export async function createBook(data: CreateBookData, token: string) {
  const res = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Failed to create book";
    try {
      const error = await res.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`${API_URL}/books/by-id/${id}`);
  
  if (!res.ok) {
    let errorMessage = "Failed to fetch book";
    try {
      const error = await res.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
