import { create } from 'zustand'
import roundService from '@/services/round'
import { BetResponse, RoundResponse } from '@/types/responses'

interface RoundState {
  round: RoundResponse | null
  currentBet: BetResponse | null
  setRound: (round: RoundResponse) => void
  setCurrentBet: (bet: BetResponse | null) => void
}

export const useRoundStore = create<RoundState>()((set) => ({
  round: null,
  currentBet: null,
  setRound: (round: RoundResponse) => set((_state) => ({ round })),
  setCurrentBet: (bet: BetResponse | null) => set((_state) => ({ currentBet: bet }))
}))

export const getRound = async (roundId: string) => {
  const round = await roundService.getRound(roundId);
  useRoundStore.getState().setRound(round);
  return round;
}

export const openRound = async (initialBet: number) => {
  const round = await roundService.openRound(initialBet);
  useRoundStore.getState().setRound(round.round);
  useRoundStore.getState().setCurrentBet(null);
  return round;
}

export const bet = async (roundId: string, betSymbol: string) => {
  const bet = await roundService.bet(roundId, betSymbol);
  useRoundStore.getState().setCurrentBet(bet);
  return bet;
}

export const claim = async (roundId: string) => {
  const round = await roundService.claim(roundId);
}


export default { getRound, openRound, bet, claim };
