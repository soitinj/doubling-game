import { requireAuth } from '@/libs/auth';
import { NextRequest, NextResponse } from 'next/server';
import Round from '@/model/round'


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const round = await Round.findRoundById((await params).id);
  if (!round) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  const [_user, userErrResponse] = requireAuth(request, round.userId);
  if (userErrResponse) return userErrResponse;
  return NextResponse.json({...round});
}