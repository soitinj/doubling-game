import Round from '@/model/round';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/libs/auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const round = await Round.findRoundById((await params).id);
  if (!round) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  const [ _user, errResponse ] = requireAuth(request, round.userId);
  if (errResponse) return errResponse;
  if (!round.stateOpen) return NextResponse.json({ message: 'Round already closed' }, { status: 400 });

  const roundEnd = await Round.claimRound(round.id)
  return NextResponse.json({ roundWin: roundEnd?.win })
}
