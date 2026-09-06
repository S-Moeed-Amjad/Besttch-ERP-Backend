export interface AuthUser {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
