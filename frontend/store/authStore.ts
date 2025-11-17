'use client';
import create from 'zustand';
import axiosClient from '../lib/axiosClient';

type User = {
  user_id?: string;
  user_name?: string;
  user_email?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (t: string | null) => void;
  setUser: (u: User | null) => void;

  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const STORAGE_TOKEN_KEY = 'notes_token';
const STORAGE_USER_KEY = 'notes_user';

export const useAuth = create<AuthState>((set, get) => {
  let token: string | null = null;
  let user: User | null = null;
  try {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem(STORAGE_TOKEN_KEY);
      const rawUser = localStorage.getItem(STORAGE_USER_KEY);
      if (rawUser) user = JSON.parse(rawUser);
    }
  } catch (e) {
    token = null;
    user = null;
  }

  return {
    token,
    user,
    loading: false,

    setToken: (t) => {
      try {
        if (typeof window !== 'undefined') {
          if (t) localStorage.setItem(STORAGE_TOKEN_KEY, t);
          else localStorage.removeItem(STORAGE_TOKEN_KEY);
        }
      } catch (e) {}
      set({ token: t });
    },

    setUser: (u) => {
      try {
        if (typeof window !== 'undefined') {
          if (u) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
          else localStorage.removeItem(STORAGE_USER_KEY);
        }
      } catch (e) {}
      set({ user: u });
    },

    login: async (email, password) => {
      set({ loading: true });
      try {
        const res = await axiosClient.post('/auth/login', { email, password });
        const data = res.data;
        const token = data.access_token;
        const user = data.user;
        if (token) {
          get().setToken(token);
          get().setUser(user);
          set({ loading: false });
          return { ok: true };
        } else {
          set({ loading: false });
          return { ok: false, message: 'No token returned' };
        }
      } catch (err: any) {
        set({ loading: false });
        const message = err?.response?.data?.detail || err?.message || 'Login failed';
        return { ok: false, message };
      }
    },

    register: async (name, email, password) => {
      set({ loading: true });
      try {
        const res = await axiosClient.post('/auth/register', { name, email, password });
        set({ loading: false });
        return { ok: true };
      } catch (err: any) {
        set({ loading: false });
        const message = err?.response?.data?.detail || err?.message || 'Registration failed';
        return { ok: false, message };
      }
    },

    logout: () => {
      get().setToken(null);
      get().setUser(null);
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_TOKEN_KEY);
          localStorage.removeItem(STORAGE_USER_KEY);
        }
      } catch (e) {}
      if (typeof window !== 'undefined') window.location.href = '/login';
    },
  };
});
