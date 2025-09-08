import { requireAuth } from '@/libs/auth';
import { NextRequest, NextResponse } from 'next/server';
import Round from '@/model/round'
import { ErrorResponse, RoundResponse } from '@/types/responses';


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<RoundResponse | ErrorResponse>> {
  const round = await Round.findRoundById((await params).id);
  if (!round) return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  const [_user, userErrResponse] = requireAuth(request, round.userId);
  if (userErrResponse) return userErrResponse;
  return NextResponse.json({...round});
}