import type { AuthSession, AuthUser } from "./types";

const USERS_KEY = "bonvan:users:v1";
const SESSION_KEY = "bonvan:session:v1";

/** Utils */
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function randomId() {
  // crypto.randomUUID() est supporté dans les navigateurs modernes
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Users */
export function loadUsers(): AuthUser[] {
  const parsed = safeParse<AuthUser[]>(localStorage.getItem(USERS_KEY));
  return parsed ?? [];
}

export function saveUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): AuthUser | undefined {
  const users = loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/** Session */
export function loadSession(): AuthSession | null {
  return safeParse<AuthSession>(localStorage.getItem(SESSION_KEY));
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/** Auth actions */
export async function signUp(email: string, password: string): Promise<AuthSession> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail.includes("@")) {
    throw new Error("Email invalide");
  }
  if (password.length < 6) {
    throw new Error("Mot de passe trop court (min 6 caractères)");
  }

  const existing = findUserByEmail(cleanEmail);
  if (existing) {
    throw new Error("Un compte existe déjà avec cet email");
  }

  const users = loadUsers();
  const passwordHash = await hashPassword(password);

  const newUser: AuthUser = {
    id: randomId(),
    email: cleanEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const session: AuthSession = {
    userId: newUser.id,
    email: newUser.email,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return session;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const cleanEmail = email.trim().toLowerCase();
  const user = findUserByEmail(cleanEmail);

  if (!user) {
    throw new Error("Aucun compte trouvé avec cet email");
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error("Mot de passe incorrect");
  }

  const session: AuthSession = {
    userId: user.id,
    email: user.email,
    loggedInAt: new Date().toISOString(),
  };

  saveSession(session);
  return session;
}
