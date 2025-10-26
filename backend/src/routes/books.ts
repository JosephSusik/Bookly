// src/routes/books.ts
import { Router } from "express";
import { prisma } from "../db";
import { bookSelect } from "../selects/book";

const router = Router();

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

export default router;
