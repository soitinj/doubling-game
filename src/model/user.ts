import { sql } from '@/libs/psql';


type DBUser = {
  id: number,
  username: string,
  passwordHash: string,
  balance: number
}

export type User = Omit<DBUser, 'passwordHash'>

async function findUserByUsername(username: string): Promise<DBUser | null> {
  const [ user ]  = await sql<DBUser[]>`SELECT * FROM users WHERE username = ${username}`;
  return user || null;
}

async function findUserById(id: number): Promise<User> {
  const [ user ]  = await sql<User[]>`SELECT id, username, balance FROM users WHERE id = ${id}`;
  return user || null;
}

async function register(username: string, passwordHash: string): Promise<User> {
  const [ user ] = await sql<User[]>`
    INSERT INTO users (username, password_hash, balance)
    VALUES (${username}, ${passwordHash}, 10000)
    RETURNING id, username, balance;
  `;
  return user;
}

export default { register, findUserByUsername, findUserById }
