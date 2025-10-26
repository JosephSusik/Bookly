import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/db";


async function main() {
  const users = [
    {
      email: "admin@bookly.com",
      name: "Admin",
      surname: "User",
      password: await bcrypt.hash("Test1234.", 10),
      role: UserRole.Admin,
    },
    {
      email: "user@bookly.com",
      name: "John",
      surname: "Reader",
      password: await bcrypt.hash("Test1234.", 10),
      role: UserRole.User,
    },
  ];

  await prisma.user.createMany({ data: users });

  console.log("✅ Seeded users!");
}
main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
