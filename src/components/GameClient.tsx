import { useRoundStore } from '@/stores/roundStore';
import { Card, ListGroup } from 'react-bootstrap';
import BetActionPanel from './BetActionPanel';
import RoundActionPanel from './RoundActionPanel';

const mapCardToStr = (card: { rank: number, suit: string }): string => {

  const getRankStr = (rank: number): string => {
    if (rank === 1) return 'A';
    if (rank === 11) return 'J';
    if (rank === 12) return 'Q';
    if (rank === 13) return 'K';
    return String(rank);
  };

  const getSuitEmoji = (suit: string): string => {
    switch (suit) {
      case 'S': return '♠️';
      case 'H': return '♥️';
      case 'D': return '♦️';
      case 'C': return '♣️';
      default: return suit;
    }
  };

  return getRankStr(card.rank) + getSuitEmoji(card.suit);
}

const GameClient = () => {
  const round = useRoundStore((state) => state.round);
  const bet = useRoundStore((state) => state.currentBet);

  return (
    <Card style={{ maxWidth: '400px' }}>
      <Card.Header>Doubling game</Card.Header>
      <ListGroup variant="flush">
        <ListGroup.Item className='text-primary'>{round ? `Round: ${round.id}` : 'No round active.'}</ListGroup.Item>
        {round && <ListGroup.Item className='text-primary'>{`Initial bet ${round.initialBet} 🪙 coins`}</ListGroup.Item>}
      </ListGroup>
      <Card.Body className='border-top bg-light'>
        {bet && (
          <>
            <div>Last card: {mapCardToStr(bet.card)}</div>
            <div>Your bet: {bet.betSymbol}</div>
            <div className={bet.bet.correct ? 'text-success' : 'text-danger'}>{bet.bet.correct ? `You WON ${bet.bet.amount} 🪙 coins!` : 'You LOST!'}</div>
          </>
        )}
      </Card.Body>
      <Card.Footer>
        <>
          {round && round.stateOpen &&
            <BetActionPanel></BetActionPanel>
          }
          {(!round || !round.stateOpen) &&
            <RoundActionPanel></RoundActionPanel>
          }
        </>
      </Card.Footer>
    </Card>
  )
}

export default GameClient;