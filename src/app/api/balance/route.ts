import { NextResponse, NextRequest } from 'next/server';
import User from '@/model/user'
import { requireAuth } from '@/libs/auth'
import { ErrorResponse, UserResponse } from '@/types/responses';


export async function GET(request: NextRequest): Promise<NextResponse<UserResponse | ErrorResponse>> {
  const [user, errResponse] = requireAuth(request);
  if (errResponse) return errResponse;
  const userInfo = await User.findUserById(user.id);
  return NextResponse.json({ ...userInfo });
}
