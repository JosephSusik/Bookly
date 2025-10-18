import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (_req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

router.post('/', async (req, res) => {
  const { title, author, isbn } = req.body;
  try {
    const book = await prisma.book.create({
      data: { title, author, isbn },
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: 'Could not create book', details: err });
  }
});

export default router;
