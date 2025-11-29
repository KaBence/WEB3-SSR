"use client"

import Popup from "./Popup";
import { State, useStoreDispatch, useStoreState } from "../../src/stores/store";
import { popup_slice } from "@/slices/popup_slice";
import * as api from "@/model/api"

interface ChallengePopupProps {
  gameId: number;
}

const ChallengePopup = ({ gameId }: ChallengePopupProps) => {
  const { showChallenge } = useStoreState((state: State) => state.popups)
  const activeGames = useStoreState((state: State) => state.active_games)
  const dispatch = useStoreDispatch()

  const challengeTrue = async () => {
    const game = activeGames.find(g => g.id === gameId);
    if (!game){
        console.log("no game")
        return
    }
    const round = game.currentRound;
    const currIdx = round!.players.findIndex(p => p.playerName === round!.currentPlayer);
    const challengedIdx = (currIdx - 1 + round!.players.length) % round!.players.length;
    const challenged = round!.players[challengedIdx];

    const handSnapshot = challenged.hand.map(c => ({ ...c }));
    console.log("befofre")
    dispatch(popup_slice.actions.closeChallenge())
    console.log("closed")
    const response = await api.challengeDraw4(gameId, true);
    dispatch(
      popup_slice.actions.openChallengeResultSnapshot({
        result: response,
        challengedPlayerId: challenged.playerName,
        handBeforeDraw: handSnapshot,
      })
    );
  }

  const challengeFalse = () => {
    api.challengeDraw4(gameId, false);
    console.log("After api")
    dispatch(popup_slice.actions.closeChallenge())
  };

  return (
    <Popup
      visible={showChallenge}
      title="Do you want to challenge the player?"
      actions={[
        {
          label: "Yes",
          onClick: async () => {
            await challengeTrue()
          },
        },
        {
          label: "No",
          onClick:  () => {
            challengeFalse();
          },
        },
      ]}
    />
  );
};

export default ChallengePopup;