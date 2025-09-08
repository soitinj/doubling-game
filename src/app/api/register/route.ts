import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from '@/model/user'
import { RegisterResponse, ErrorResponse } from '@/types/responses';


const registerSchema = z.object({
  username: z.string(),
  password: z.string().min(3),
});


export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse | ErrorResponse>> {
  const result = registerSchema.safeParse(await request.json())
  if (!result.success) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  const { username, password } = result.data

  const passwordHash = await bcrypt.hash(password, 4);
  const user = await User.register(username, passwordHash)
  return NextResponse.json({ id: user.id, username: user.username, balance: user.balance })
}
