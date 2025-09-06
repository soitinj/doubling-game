import { sql } from '@/libs/psql';


export type Round = {
  id: string,
  userId: number,
  open: boolean,
  createdAt: string
}

export async function findRoundsByUser(userId: number): Promise<Round[]> {
  const rounds = await sql<Round[]>`
    SELECT * FROM rounds WHERE user_id = ${ userId }
  `;
  return rounds;
}

export async function findOpenRoundsByUser(userId: number): Promise<Round[]> {
  const rounds = await sql<Round[]>`
    SELECT * FROM rounds WHERE user_id = ${ userId } AND open = TRUE
  `;
  return rounds;
}

export async function openRound(userId: number, initialBet: number): Promise<Round | null> {
  const [ round ] = await sql<Round[]>`
    INSERT INTO rounds (user_id, open)
    VALUES (${ userId }, FALSE)
    RETURNING id, user_id, open, created_at;
  `;
  return round ?? null;  
}

export async function closeRound(roundId: string, userId: number): Promise<Round | null> {
  const [ round ] = await sql<Round[]>`
    UPDATE rounds
    SET open = FALSE
    WHERE round_id = ${ roundId }
    RETURNING id, user_id, open, created_at
  `;
  return round ?? null;
}

export default { findRoundsByUser, findOpenRoundsByUser, openRound, closeRound }