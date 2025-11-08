import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Book = {
    id: string;
    ISBN: string;
    title: string;
    subtitle: string | null;
    publisher: string | null;
    authors: string[];
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
        cell: ({ row }) => {
            const date = row.getValue("published_date") as Date | null;
            if (!date) return null;
            try {
                return format(new Date(date), "dd.MM.yyyy");
            } catch {
                return null;
            }
        },
    },
    {
        accessorKey: "page_count",
        header: "Page Count",
    },
    {
        accessorKey: "language",
        header: "Language",
    },
    {
        accessorKey: "authors",
        header: "Authors",
        cell: ({ row }) => {
            const authors = row.getValue("authors") as string[];
            return authors?.join(", ") || "";
        },
    },
]
