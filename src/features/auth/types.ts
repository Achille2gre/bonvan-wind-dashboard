export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  loggedInAt: string;
}
