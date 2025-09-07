import { NextResponse, NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '@/model/user'
import { JWT_SECRET, UserPayload } from '@/libs/auth'


const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});


export async function POST(request: NextRequest) {
  const result = loginSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ error: 'Bad Request'}, { status: 400 });
  const { username, password } = result.data;

  const user = await User.findUserByUsername(username)

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    //console.log(`USER ID: ${user.id}`)
    const userForToken: UserPayload = {
      id: user.id,
      username: user.username,
      balance: user.balance
    }
    const token = jwt.sign(userForToken, JWT_SECRET)
    return NextResponse.json({ token: token, id: user.id, username: user.username, balance: user.balance })
  } else if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  } else {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }
}
