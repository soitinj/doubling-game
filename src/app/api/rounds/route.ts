import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { zparse } from '@/libs/util';
import { requireAuth } from '@/libs/auth';
import Round from '@/model/round'
import { ErrorResponse, OpenRoundResponse, RoundResponse } from '@/types/responses';

const roundSchema = z.object({
  initialBet: z.union([z.literal(100), z.literal(200), z.literal(500), z.literal(1000)])
});

export async function POST(request: NextRequest): Promise<NextResponse<OpenRoundResponse | ErrorResponse>> {
  const [user, authErrResponse] = requireAuth(request);
  if (authErrResponse) return authErrResponse;
  const [data, errResponse] = await zparse(request, roundSchema);
  if (errResponse) return errResponse;
  const { initialBet } = data;

  try {
    const [round, newUser] = await Round.openRound(user.id, initialBet);
    return NextResponse.json({ round: round!, user: newUser! }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<RoundResponse[] | ErrorResponse>> {
  const [ user, authErrResponse ] = requireAuth(request);
  if (authErrResponse) return authErrResponse;
  const rounds = await Round.findOpenRoundsByUser(user.id);
  return NextResponse.json([ ...rounds ]);
}
