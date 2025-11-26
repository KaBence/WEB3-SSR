import Popup from "./Popup";
import { useStoreState, useStoreDispatch } from "../../src/stores/store";
import type { CardSpecs } from "../../src/model/game";
import UnoCard from "../game/UnoCard";
import { Type } from "Domain/src/model/Card";

interface PlayPopupProps {
  gameId: number;
  cardIndex: number;
  newCard: CardSpecs;
}

const PlayPopup = ({ gameId, cardIndex, newCard }: PlayPopupProps) => {
  const dispatch = useStoreDispatch();
  const { showPlay } = useStoreState().popups;

  return (
    <div>
      <Popup
          visible={showPlay}
          title="Do you want to play?"
          actions={[
            {
              label: "Play",
              onClick: async () => {
                if(newCard.Type === Type.Wild || newCard.Type === Type.WildDrawFour){
                  openPopup({popup: "ChooseColor"}, dispatch)
                }
                else {
                  await playCard(gameId,cardIndex,dispatch)
                }
            }},
            {
              label: "Draw",
              onClick: async () => {
                await drawCard(gameId, dispatch);
              },
            },
          ]}
        >
        <UnoCard card={newCard}></UnoCard>
      </Popup>
    </div>
  );
};

export default PlayPopup;
