import { useState } from "react";
import { Button } from "react-bootstrap";
import roundActions from "@/stores/roundStore";
import userActions from "@/stores/userStore"

const RoundActionPanel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startRoundWith = async (coins: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await roundActions.openRound(coins);
      await userActions.balance();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>Place initial bet:</div>
      <Button onClick={() => startRoundWith(100)} disabled={isLoading}>100 🪙 coins</Button>
      <Button onClick={() => startRoundWith(200)} disabled={isLoading}>200 🪙 coins</Button>
      <Button onClick={() => startRoundWith(500)} disabled={isLoading}>500 🪙 coins</Button>
    </div>
  )
}

export default RoundActionPanel;