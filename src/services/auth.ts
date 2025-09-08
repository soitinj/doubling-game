import axios from 'axios'
import { getConfig } from '@/services/config';
import { BalanceResponse, LoginResponse, RegisterResponse } from '@/types/responses';


const baseUrl = `/api`;

const login = async (credentials: { username: string, password: string }): Promise<LoginResponse> => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
}

const register = async (credentials: { username: string, password: string }): Promise<RegisterResponse> => {
  const response = await axios.post(`${baseUrl}/register`, credentials);
  return response.data;
}

const balance = async (): Promise<BalanceResponse> => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/balance`, config);
  return response.data;
}

export default { login, register, balance }