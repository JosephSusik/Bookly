import { ColumnDef } from "@tanstack/react-table";

export type Book = {
    ISBN: string;
    title: string;
    subtitle: string | null;
    publisher: string | null;
    published_date: Date | null;
    page_count: number | null;
    language: string | null;
    description: string | null;
    cover_url: string | null;
    created_at: Date;
    updated_at: Date | null;
    genres: {
      id: number;
      name: string;
    }[];
    created_by: {
      id: string;
      name: string;
      surname: string;
      email: string;
    };
    addedByUsers: {
      id: string;
      name: string;
      surname: string;
    }[];
    authors: {
      id: number;
      name: string;
    }[];
  };
  
  export const bookColumns: ColumnDef<Book>[] = [
    {
        accessorKey: "ISBN",
        header: "ISBN",
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "subtitle",
        header: "Subtitle",
    },
    {
        accessorKey: "publisher",
        header: "Publisher",
    },
    {
        accessorKey: "published_date",
        header: "Published Date",
    },
    {
        accessorKey: "page_count",
        header: "Page Count",
    },
    {
        accessorKey: "language",
        header: "Language",
    },
]
