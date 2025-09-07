import Round from '@/model/round';
import Bet from '@/model/bet'
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/libs/auth'
import { zparse, randomCard } from '@/libs/util'
import { z } from 'zod';

const betSchema = z.object({
  betSymbol: z.enum(['HIGH', 'LOW'])
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const round = await Round.findRoundById((await params).id);
  if (!round) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  const [ _user, authErrResponse ] = requireAuth(request, round.userId);
  if (authErrResponse) return authErrResponse;
  if (!round.stateOpen) return NextResponse.json({ message: 'Round closed' }, { status: 400 });

  const [data, errorResponse] = await zparse(request, betSchema);
  if (errorResponse) return errorResponse;
  const { betSymbol } = data;

  const card = randomCard();
  const correctBet = (card.rank < 7 && betSymbol === 'LOW') || (card.rank > 7 && betSymbol === 'HIGH');

  const bet = await Bet.placeBet(round.id, correctBet);
  return NextResponse.json({ betSymbol, card, bet });
}
