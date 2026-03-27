import express from "express";
import cors from "cors";
import {
  createUser,
  getAllUsers,
  getHeatmapPointsFromUsers,
  validateUserCredentials,
} from "./database/users-db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const GOVERNMENT_EMAIL = process.env.GOVERNMENT_EMAIL || "govt@natpac.app";
const GOVERNMENT_PASSWORD = process.env.GOVERNMENT_PASSWORD || "govt123";
const GOVERNMENT_NAME = process.env.GOVERNMENT_NAME || "Government Admin";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  try {
    const createdUser = await createUser({
      name,
      email,
      password,
      role: "user",
    });

    return res.status(201).json({
      message: "account created",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return res.status(409).json({ message: "account already exists" });
    }

    return res.status(500).json({ message: "failed to create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body || {};

  if (!email || !password || !role) {
    return res.status(400).json({ message: "email, password and role are required" });
  }

  if (!["user", "government"].includes(role)) {
    return res.status(400).json({ message: "invalid role" });
  }

  if (role === "government") {
    const isGovLogin =
      String(email || "").trim().toLowerCase() === GOVERNMENT_EMAIL.toLowerCase() &&
      String(password || "") === GOVERNMENT_PASSWORD;

    if (!isGovLogin) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    return res.json({
      message: "login successful",
      user: {
        id: "government",
        name: GOVERNMENT_NAME,
        email: GOVERNMENT_EMAIL,
        role: "government",
      },
    });
  }

  const matchedUser = await validateUserCredentials({ email, password, role });
  if (!matchedUser) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  return res.json({
    message: "login successful",
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    },
  });
});

app.get("/api/admin/users", async (_, res) => {
  const users = await getAllUsers();
  const userSummaries = users
    .filter((user) => user.role === "user")
    .map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    totalTrips: user.trips.length,
  }));

  res.json({ users: userSummaries });
});

app.get("/api/admin/heatmap", async (_, res) => {
  res.json({ points: await getHeatmapPointsFromUsers() });
});

app.listen(PORT, () => {
  console.log(`NATPAC backend listening on http://localhost:${PORT}`);
});
