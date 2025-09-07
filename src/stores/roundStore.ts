import { create } from 'zustand'
import roundService, { ClientBet, ClientRound } from '@/services/round'

interface RoundState {
  round: ClientRound | null
  currentBet: ClientBet | null
  setRound: (round: ClientRound) => void
  setCurrentBet: (bet: ClientBet | null) => void
}

export const useRoundStore = create<RoundState>()((set) => ({
  round: null,
  currentBet: null,
  setRound: (round: ClientRound) => set((_state) => ({ round })),
  setCurrentBet: (bet: ClientBet | null) => set((_state) => ({ currentBet: bet }))
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
