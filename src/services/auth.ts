import axios from 'axios'
import { User } from '@/model/user';
import { getConfig } from '@/services/config';


export type ClientUser = User & { token: string }

const baseUrl = `/api`;

const login = async (credentials: { username: string, password: string }): Promise<ClientUser> => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
}

const register = async (credentials: { username: string, password: string }): Promise<ClientUser> => {
  const response = await axios.post(`${baseUrl}/register`, credentials);
  return response.data;
}

const balance = async (): Promise<User> => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/balance`, config);
  return response.data;
}

export default { login, register, balance }