let token: string | null = null;

export const hostURL = process.env.NEXT_PUBLIC_HOST_URL;

export const setToken = (newToken: string | null) => {
  token = `Bearer ${newToken}`;
}

export const getConfig = () => ({ headers: { Authorization: token } });
