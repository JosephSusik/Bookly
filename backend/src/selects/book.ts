// src/constants/bookSelect.ts
import { Prisma } from "@prisma/client";

export const bookSelect: Prisma.BookSelect = {
  ISBN: true,
  title: true,
  subtitle: true,
  publisher: true,
  published_date: true,
  page_count: true,
  language: true,
  description: true,
  cover_url: true,
  created_at: true,
  updated_at: true,
  genres: true,
  // Relations
  created_by: {
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
    },
  },
  addedByUsers: {
    select: {
      id: true,
      name: true,
      surname: true,
    },
  },
  authors: {
    select: {
      id: true,
      name: true,
    },
  },
    
};
