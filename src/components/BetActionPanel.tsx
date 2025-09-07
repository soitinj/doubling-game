import roundActions, { useRoundStore } from '@/stores/roundStore';
import userActions from '@/stores/userStore'
import { useState } from 'react';
import { Button } from 'react-bootstrap';


const BetActionPanel = () => {
  const round = useRoundStore((state) => state.round)!;
  const bet = useRoundStore((state) => state.currentBet);
  const [isLoading, setIsLoading] = useState(false);

  const betOn = (symbol: 'HIGH' | 'LOW') => {
    return async () => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        await roundActions.bet(round.id, symbol);
        await roundActions.getRound(round.id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const claimRound = async () => {
    setIsLoading(true);
    try {
      await roundActions.claim(round.id);
      await roundActions.getRound(round.id);
      await userActions.balance();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div>Next action: (chance to win {(bet && bet.bet.amount) ? bet.bet.amount * 2 : round.initialBet * 2} 🪙 coins.)</div>
      <Button onClick={betOn('HIGH')} disabled={isLoading}>Bet HIGH</Button>
      <Button onClick={betOn('LOW')} disabled={isLoading}>Bet LOW</Button>
      <Button variant='success' onClick={claimRound} disabled={isLoading || !bet}>Claim</Button>
    </div>
  )
}

export default BetActionPanel;