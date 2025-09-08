import { create } from 'zustand'
import auth from '@/services/auth'
import { setToken } from '@/services/config'
import { LoginResponse } from '@/types/responses'

interface UserState {
  user: LoginResponse | null
  setUser: (user: LoginResponse | null) => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set((_state) => ({ user }))
}))

const login = async (username: string, password: string) => {
  const user = await auth.login({ username, password });
  useUserStore.getState().setUser(user);
  setToken(user.token);
  window.localStorage.setItem('doublingplayer', JSON.stringify(user));
}

const register = async (username: string, password: string) => {
  await auth.register({ username, password });
  await login(username, password);
}

const logout = () => {
  useUserStore.getState().setUser(null);
  setToken(null);
  window.localStorage.clear();
}

const userFromCache = async () => {
  const cachedUser = localStorage.getItem('doublingplayer');
  if (!cachedUser) return;
  const user = JSON.parse(cachedUser) as LoginResponse;
  useUserStore.getState().setUser(user);
  setToken(user.token);
}

const balance = async () => {
  const user = useUserStore.getState().user;
  if (!user) return;
  const newUser = await auth.balance();
  useUserStore.getState().setUser({ ...user, balance: newUser.balance });
}

export default { login, register, logout, userFromCache, balance };
