import { useUserStore } from '@/stores/userStore';
import { Button } from 'react-bootstrap'
import GameClient from './GameClient';


const GameContent = () => {
  const user = useUserStore((state) => state.user);
  return (
    <>
      {user && (
        <GameClient></GameClient>
      )}
      {!user && (
        <div>Please login or register to play. New registers get 10000 🪙 coins.</div>
      )}
    </>
  )
}

export default GameContent;