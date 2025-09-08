import { Bet } from "@/model/bet";
import { Round } from "@/model/round";
import { User } from "@/model/user";

// API response payloads
export type UserResponse = User;

export type LoginResponse = User & { token: string };

export type BalanceResponse = User;

export type OpenRoundResponse = {
  round: Round,
  user: User
}

export type RoundResponse = Round;

export type BetResponse = {
  bet: Bet,
  card: { rank: number, suit: string },
  betSymbol: string
}

export type ClaimResponse = {
  roundWin: number
}

// Specify for error cases for better type-checking
export type ErrorResponse = {
  message: string
}
