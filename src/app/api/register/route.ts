import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '@/model/user'


const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});


export async function POST(request: NextRequest) {
  const result = registerSchema.safeParse(await request.json())
  if (!result.success) return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  const { username, password } = result.data

  const passwordHash = await bcrypt.hash(password, 4);
  const user = await User.register(username, passwordHash)
  return NextResponse.json({ userId: user.id, username: user.username, balance: user.balance })
}
