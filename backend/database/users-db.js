import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, "users.json");

const readUsers = async () => {
  const file = await readFile(usersFilePath, "utf-8");
  return JSON.parse(file);
};

const writeUsers = async (users) => {
  await writeFile(usersFilePath, JSON.stringify(users, null, 2) + "\n", "utf-8");
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

export const getAllUsers = async () => readUsers();

export const findUserByEmail = async (email) => {
  const users = await readUsers();
  const target = normalizeEmail(email);
  return users.find((user) => normalizeEmail(user.email) === target) || null;
};

export const createUser = async ({ name, email, password, role = "user" }) => {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);

  const alreadyExists = users.some((user) => normalizeEmail(user.email) === normalizedEmail);
  if (alreadyExists) {
    throw new Error("USER_EXISTS");
  }

  const createdUser = {
    id: `u${Date.now()}`,
    name: String(name || "").trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: String(password || ""),
    role,
    trips: [],
  };

  users.push(createdUser);
  await writeUsers(users);

  return createdUser;
};

export const validateUserCredentials = async ({ email, password, role }) => {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);

  return (
    users.find(
      (user) =>
        normalizeEmail(user.email) === normalizedEmail &&
        user.password === String(password || "") &&
        user.role === role
    ) || null
  );
};

export const getHeatmapPointsFromUsers = async () => {
  const users = await readUsers();
  const counts = {};

  users
    .filter((user) => user.role === "user")
    .forEach((user) => {
      (user.trips || []).forEach((route) => {
        String(route)
          .split("-")
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach((place) => {
            counts[place] = (counts[place] || 0) + 1;
          });
      });
    });

  return Object.entries(counts)
    .map(([place, visits]) => ({ place, visits }))
    .sort((a, b) => b.visits - a.visits);
};
