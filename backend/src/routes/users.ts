import { Router } from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Register user
router.post("/register", async (req, res) => {
  const { email, name, surname, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, name, surname, password: hashedPassword },
    });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Login successful", token, user });
});

// Get current user (protected)
router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
