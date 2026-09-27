import { getUserByEmail, upsertUser } from "@/lib/google/sheets";
export const userRepository = { getByEmail: getUserByEmail, upsert: upsertUser };
