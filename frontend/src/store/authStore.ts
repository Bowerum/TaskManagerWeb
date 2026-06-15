import { create } from "zustand";
import { persist } from "zustand/middleware";

export const Role = {
  Executor: 1,
  Manager: 2,
  Admin: 3,
}

export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  email: string;
  name: string;
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

const roleId = useAuthStore((state) => state.user?.roleId);
