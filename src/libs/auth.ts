import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { ErrorResponse } from "@/types/responses";

export const JWT_SECRET = process.env.JWT_SECRET || 'examplesecretpleasereplace';

export interface UserPayload extends JwtPayload {
  id: number;
  username: string;
  balance: number;
}

export const requireAuth = (request: NextRequest, targetUserId?: number): [UserPayload, null] | [null, NextResponse<ErrorResponse>] => {
  // Return User if auth is ok, else NextResponse (error)
  const errorResponse = NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const authorization = request.headers.get('authorization')
  try {
    const token = authorization && authorization.startsWith('Bearer ') ?
      jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET) as UserPayload :
      null
    if (token && targetUserId) {
      // Attempting to access a resource belonging to a specific user
      return token.id === targetUserId ? [token, null] : [null, errorResponse];
    } else if (token) {
      return [token, null];
    }
  } catch (err) {
    return [null, errorResponse];
  }
  return [null, errorResponse];
}
