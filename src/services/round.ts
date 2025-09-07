import axios from 'axios'
import { getConfig } from '@/services/config'
import { Round } from '@/model/round'
import { Bet } from '@/model/bet'
import { User } from '@/model/user'

const baseUrl = `/api/rounds`

export type ClientRound = Round & {}

export type ClientBet = {
  bet: Bet,
  card: { rank: number, suit: string },
  betSymbol: string
}

export type OpenRoundResponse = {
  round: ClientRound,
  user: User
}

const getOpenRounds = async (): Promise<ClientRound[]> => {
  const config = getConfig()
  const response = await axios.get(baseUrl, config)
  return response.data.rounds
}

const getRound = async (roundId: string): Promise<ClientRound> => {
  const config = getConfig()
  const response = await axios.get(`${baseUrl}/${roundId}`, config)
  return response.data
}

const openRound = async (initialBet: number): Promise<OpenRoundResponse> => {
  const config = getConfig()
  const response = await axios.post(baseUrl, { initialBet }, config)
  return response.data
}

const bet = async (roundId: string, betSymbol: string): Promise<ClientBet> => {
  const config = getConfig()
  const response = await axios.post(`${baseUrl}/${roundId}/bet`, { betSymbol }, config)
  return response.data
}

const claim = async (roundId: string): Promise<ClientRound> => {
  const config = getConfig()
  const response = await axios.post(`${baseUrl}/${roundId}/claim`, {}, config)
  return response.data
}

export default { getOpenRounds, getRound, openRound, bet, claim }