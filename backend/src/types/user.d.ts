export interface IUser {
  id: string;
  role: "public" | "staff";
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
