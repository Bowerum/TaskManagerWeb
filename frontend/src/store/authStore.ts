import { create } from "zustand";
import { persist } from "zustand/middleware";

export const Role = {
  Admin: 1,
  Manager: 2,
  Executor: 3,
}
export const RoleNames = {
  [Role.Admin]: "Администратор",
  [Role.Manager]: "Менеджер",
  [Role.Executor]: "Исполнитель",
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  roleId: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, user) =>
        set({
          token,
          user,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

