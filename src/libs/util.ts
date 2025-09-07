import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'


export const zparse = async <T>(request: NextRequest, schema: z.ZodSchema<T>): Promise<[T, null] | [null, NextResponse]> => {
  const result = schema.safeParse(await request.json());
  if (!result.success) {
    return [null, NextResponse.json({ error: 'Bad Request'}, { status: 400 })]
  } else {
    return [result.data, null]
  }
}

export const randomCard = (): {rank: number, suit: string} => {
  const suits = ['H', 'D', 'C', 'S'];
  const ranks = Array.from({ length: 13 }, (_, i) => i + 1);

  const suit = suits[Math.floor(Math.random() * suits.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];

  return { rank, suit };
}
