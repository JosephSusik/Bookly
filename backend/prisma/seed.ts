import { UserRole, BookGenre } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/db";

async function main() {
  // 1️⃣ Seed users
  const admin = await prisma.user.create({
    data: {
      email: "admin@bookly.com",
      name: "Admin",
      surname: "User",
      password: await bcrypt.hash("Test1234.", 10),
      role: UserRole.Admin,
    },
  });
  
  const user = await prisma.user.create({
    data: {
      email: "user@bookly.com",
      name: "John",
      surname: "Reader",
      password: await bcrypt.hash("Test1234.", 10),
      role: UserRole.User,
    },
  });
  console.log("✅ Seeded users!");

  // 2️⃣ Seed authors
  const author1 = await prisma.author.create({
    data: { name: "J.K. Rowling" },
  });

  const author2 = await prisma.author.create({
    data: { name: "George R.R. Martin" },
  });

  console.log("✅ Seeded authors!");

  // 3️⃣ Seed books for each author
  const books = [
    {
      ISBN: "9780747532699",
      title: "Harry Potter and the Philosopher's Stone",
      publisher: "Bloomsbury",
      authors: { connect: { id: author1.id } },
      created_by_id: admin.id,
      genres: [BookGenre.Fantasy],
    },
    {
      ISBN: "9780747538493",
      title: "Harry Potter and the Chamber of Secrets",
      publisher: "Bloomsbury",
      authors: { connect: { id: author1.id } },
      created_by_id: admin.id,
      genres: [BookGenre.Fantasy],
    },
    {
      ISBN: "9780747542155",
      title: "Harry Potter and the Prisoner of Azkaban",
      publisher: "Bloomsbury",
      authors: { connect: { id: author1.id } },
      created_by_id: admin.id,
      genres: [BookGenre.Fantasy],
    },
    {
      ISBN: "9780553103540",
      title: "A Game of Thrones",
      publisher: "Bantam Books",
      authors: { connect: { id: author2.id } },
      created_by_id: admin.id,
      genres: [BookGenre.Fantasy],
    },
    {
      ISBN: "9780553108033",
      title: "A Clash of Kings",
      publisher: "Bantam Books",
      authors: { connect: { id: author2.id } },
      created_by_id: user.id,
      genres: [BookGenre.Fantasy],
    },
    {
      ISBN: "9780553106633",
      title: "A Storm of Swords",
      publisher: "Bantam Books",
      authors: { connect: { id: author2.id } },
      created_by_id: user.id,
      genres: [BookGenre.Fantasy],
    },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  console.log("✅ Seeded books!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
