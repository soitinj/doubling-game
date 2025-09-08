import axios from 'axios'
import { getConfig } from '@/services/config'
import { BetResponse, OpenRoundResponse, RoundResponse } from '@/types/responses'

const baseUrl = `/api/rounds`

const getOpenRounds = async (): Promise<RoundResponse[]> => {
  const config = getConfig()
  const response = await axios.get(baseUrl, config)
  return response.data.rounds
}

const getRound = async (roundId: string): Promise<RoundResponse> => {
  const config = getConfig()
  const response = await axios.get<RoundResponse>(`${baseUrl}/${roundId}`, config)
  return response.data
}

const openRound = async (initialBet: number): Promise<OpenRoundResponse> => {
  const config = getConfig()
  const response = await axios.post(baseUrl, { initialBet }, config)
  return response.data
}

const bet = async (roundId: string, betSymbol: string): Promise<BetResponse> => {
  const config = getConfig()
  const response = await axios.post(`${baseUrl}/${roundId}/bet`, { betSymbol }, config)
  return response.data
}

const claim = async (roundId: string): Promise<RoundResponse> => {
  const config = getConfig()
  const response = await axios.post(`${baseUrl}/${roundId}/claim`, {}, config)
  return response.data
}

export default { getOpenRounds, getRound, openRound, bet, claim }