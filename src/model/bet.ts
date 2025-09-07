import { sql } from '@/libs/psql';

export type Bet = {
  id: string,
  roundId: string,
  userId: number,
  amount: number,
  correct: boolean,
  createdAt: string
}

async function placeBet(roundId: string, correct: boolean): Promise<Bet | null> {
  const bet = await sql.begin(async sql => {
    const [ rOpen ] = await sql<{ stateOpen: boolean, initialBet: number, userId: number }[]>`
      SELECT state_open, initial_bet, user_id
      FROM rounds
      WHERE id = ${ roundId }
      FOR UPDATE;
    `;
    if (!rOpen) throw new Error("Round not found")
    if (!rOpen.stateOpen) throw new Error("Cannot bet on a closed round");

    const previousBets = await sql<Bet[]>`
      SELECT *
      FROM bets
      WHERE round_id = ${ roundId }
      FOR UPDATE;
    `;
    //console.log(previousBets);
    const betAmount = previousBets.length === 0 ?
      rOpen.initialBet * 2 :
      previousBets.reduce((max, bet) => bet.amount > max.amount ? bet : max).amount * 2;

    const [ bet ] = await sql<Bet[]>`
      INSERT INTO bets (round_id, user_id, amount, correct)
      VALUES (${ roundId }, ${ rOpen.userId }, ${ betAmount }, ${ correct })
      RETURNING id, round_id, user_id, amount, correct, created_at;
    `;

    if (!correct) {
      await sql`
        UPDATE rounds
        SET state_open = FALSE, win = 0
        WHERE id = ${ roundId }
      `;
    }
    return bet;
  })
  return bet ?? null
}

export default { placeBet }
