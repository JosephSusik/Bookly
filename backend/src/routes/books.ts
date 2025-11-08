// src/routes/books.ts
import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { bookSelect } from "../selects/book";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Helper middleware to extract user from JWT token
interface AuthRequest extends Request {
  userId?: string;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token" });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET /books/all - all books
router.get("/all", async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      select: bookSelect
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET /books/:userId - books that a user has in library
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await prisma.book.findMany({
      where: {
        addedByUsers: {
          some: { id: userId },
        },
      },
      select: bookSelect
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user's books" });
  }
});

// GET /books/createdBy/:userId - books added by a specific user
router.get("/createdBy/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const books = await prisma.book.findMany({
      where: { created_by_id: userId },
      select: bookSelect
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books created by user" });
  }
});

// GET /books/by-id/:id - single book by ID
router.get("/by-id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      select: bookSelect
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// GET /books/:ISBN - single book by ISBN
router.get("/:ISBN", async (req, res) => {
  const { ISBN } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: { ISBN },
      select: bookSelect
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// POST /books/search-by-isbn - Search for book by ISBN
router.post("/search-by-isbn", authenticateToken, async (req: AuthRequest, res) => {
  const { ISBN } = req.body;
  const userId = req.userId!;

  if (!ISBN) {
    return res.status(400).json({ error: "ISBN is required" });
  }

  try {
    // 1st: Check if book exists in our DB
    const existingBook = await prisma.book.findUnique({
      where: { ISBN },
      include: {
        addedByUsers: {
          where: { id: userId },
          select: { id: true }
        }
      }
    });

    if (existingBook) {
      // Book exists in DB
      const isInUserLibrary = existingBook.addedByUsers.length > 0;
      
      if (!isInUserLibrary) {
        // Book exists but not in user's library - return prefilled data
        return res.json({
          source: "database",
          book: {
            ISBN: existingBook.ISBN,
            title: existingBook.title,
            subtitle: existingBook.subtitle || undefined,
            authors: existingBook.authors,
            publisher: existingBook.publisher || undefined,
            published_date: existingBook.published_date || undefined,
            page_count: existingBook.page_count || undefined,
            language: existingBook.language || undefined,
            description: existingBook.description || undefined,
            cover_url: existingBook.cover_url || undefined,
          },
          disabledFields: [
            "ISBN",
            "title",
            "subtitle",
            "authors",
            "publisher",
            "published_date",
            "page_count",
            "language",
            "description",
            "cover_url"
          ]
        });
      } else {
        // Book already in user's library
        return res.status(400).json({ error: "Book already in your library" });
      }
    }

    // 2nd: Book not in DB - query Google Books API
    try {
      const googleBooksResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`
      );

      if (!googleBooksResponse.ok) {
        throw new Error("Google Books API request failed");
      }

      const googleData = await googleBooksResponse.json();

      if (googleData.totalItems > 0 && googleData.items && googleData.items.length > 0) {
        const volumeInfo = googleData.items[0].volumeInfo;
        
        // Extract relevant fields from Google Books API
        const bookData = {
          ISBN: ISBN,
          title: volumeInfo.title || "",
          subtitle: volumeInfo.subtitle || undefined,
          authors: volumeInfo.authors || [],
          publisher: volumeInfo.publisher || undefined,
          published_date: volumeInfo.publishedDate 
            ? new Date(volumeInfo.publishedDate) 
            : undefined,
          page_count: volumeInfo.pageCount || undefined,
          language: volumeInfo.language || undefined,
          description: volumeInfo.description || undefined,
          cover_url: volumeInfo.imageLinks?.thumbnail || 
                     volumeInfo.imageLinks?.smallThumbnail || 
                     undefined,
        };

        return res.json({
          source: "google_books",
          book: bookData,
          disabledFields: [] // User can edit all fields from Google Books
        });
      }
    } catch (googleError) {
      console.error("Google Books API error:", googleError);
      // Continue to fallback
    }

    // 3rd: No hits - just return ISBN for manual entry
    return res.json({
      source: "manual",
      book: {
        ISBN: ISBN,
      },
      disabledFields: []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search for book" });
  }
});

// POST /books - Create or update a book
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const {
    ISBN,
    title,
    subtitle,
    authors,
    publisher,
    published_date,
    page_count,
    language,
    description,
    cover_url,
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    // Check if book with this ISBN already exists
    let book;
    if (ISBN) {
      book = await prisma.book.findUnique({
        where: { ISBN },
        include: {
          addedByUsers: {
            where: { id: userId },
            select: { id: true }
          }
        }
      });
    }

    if (book) {
      // Book exists - update it and add to user's library if not already there
      const isInUserLibrary = book.addedByUsers.length > 0;

      if (!isInUserLibrary) {
        // Add book to user's library
        await prisma.book.update({
          where: { id: book.id },
          data: {
            addedByUsers: {
              connect: { id: userId }
            },
            // Update fields if provided
            ...(description && { description }),
            ...(cover_url && { cover_url }),
            updated_at: new Date(),
          }
        });

        const updatedBook = await prisma.book.findUnique({
          where: { id: book.id },
          select: bookSelect
        });

        return res.status(200).json({ message: "Book added to library", book: updatedBook });
      } else {
        // Book already in library - just update if needed
        const updatedBook = await prisma.book.update({
          where: { id: book.id },
          data: {
            ...(description && { description }),
            ...(cover_url && { cover_url }),
            updated_at: new Date(),
          },
          select: bookSelect
        });

        return res.status(200).json({ message: "Book updated", book: updatedBook });
      }
    } else {
      // Create new book
      const newBook = await prisma.book.create({
        data: {
          ISBN: ISBN || undefined,
          title,
          subtitle: subtitle || undefined,
          authors: authors || [],
          publisher: publisher || undefined,
          published_date: published_date ? new Date(published_date) : undefined,
          page_count: page_count || undefined,
          language: language || undefined,
          description: description || undefined,
          cover_url: cover_url || undefined,
          created_by_id: userId,
          addedByUsers: {
            connect: { id: userId }
          }
        },
        select: bookSelect
      });

      return res.status(201).json({ message: "Book created", book: newBook });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create/update book" });
  }
});

export default router;
