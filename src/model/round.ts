import { sql } from '@/libs/psql';
import { User } from '@/model/user';
import { Bet } from '@/model/bet';


export type Round = {
  id: string,
  userId: number,
  stateOpen: boolean,
  initialBet: number,
  win: number,
  createdAt: string
}

async function findRoundsByUser(userId: number): Promise<Round[]> {
  const rounds = await sql<Round[]>`
    SELECT * FROM rounds WHERE user_id = ${ userId }
  `;
  return rounds;
}

async function findOpenRoundsByUser(userId: number): Promise<Round[]> {
  const rounds = await sql<Round[]>`
    SELECT * FROM rounds WHERE user_id = ${ userId } AND state_state_open = TRUE
  `;
  return rounds;
}

async function findRoundById(roundId: string): Promise<Round | null> {
  const [ round ] = await sql<Round[]>`
    SELECT * FROM rounds WHERE id = ${ roundId }
  `;
  return round ?? null;
}

async function openRound(userId: number, initialBet: number): Promise<[Round | null, User | null]> {
  const [round, user] = await sql.begin(async sql => {
    const [ user ] = await sql<User[]>`
      SELECT id, balance
      FROM users
      WHERE id = ${userId}
      FOR UPDATE;
    `;
    if (!user) throw new Error("Not Found");

    if (user.balance <= initialBet) throw new Error("Insufficient balance");

    await sql`
      UPDATE users
      SET balance = balance - ${ initialBet }
      WHERE id = ${ userId };
    `;

    const [ round ] = await sql<Round[]>`
      INSERT INTO rounds (user_id, state_open, initial_bet, win)
      VALUES (${ userId }, TRUE, ${ initialBet }, 0)
      RETURNING id, user_id, state_open, initial_bet, win, created_at;
    `
    return [round ?? null, user];
  })

  return [round, user];
}

async function claimRound(roundId: string): Promise<Round | null> {
  const round = await sql.begin(async sql => {
    const [ rOpen ] = await sql<{ stateOpen: boolean }[]>`
      SELECT state_open
      FROM rounds
      WHERE id = ${ roundId }
      FOR UPDATE;
    `
    if (!rOpen) throw new Error("Not Found");
    if (!rOpen.stateOpen) throw new Error("Already closed");

    const bets = await sql<Bet[]>`
      SELECT *
      FROM bets
      WHERE round_id = ${ roundId }
      FOR UPDATE;
    `
    const { amount } = bets.reduce((max, bet) => bet.amount > max.amount ? bet : max);

    if (!bets.every(b => b.correct)) throw new Error("Cannot claim a round where all bets are not wins")

    const [ round ] = await sql<Round[]>`
      UPDATE rounds
      SET state_open = FALSE, win = ${ amount }
      WHERE id = ${ roundId }
      RETURNING id, user_id, state_open, initial_bet, win, created_at
    `
    await sql`
      UPDATE users
      SET balance = balance + ${ amount }
      WHERE id = ${ round.userId }
    `
    return round
  })
  return round ?? null;
}

export default { findRoundsByUser, findOpenRoundsByUser, findRoundById, openRound, claimRound }
