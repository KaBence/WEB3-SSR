import Popup from "./Popup";
import { useStoreDispatch, useStoreState } from "../../src/stores/store";

interface ChallengePopupProps {
  gameId: number;
}

const ChallengePopup = ({ gameId }: ChallengePopupProps) => {
  const dispatch = useStoreDispatch();
  const { showChallenge } = useStoreState().popups;

  return (
    <Popup
      visible={showChallenge}
      title="Do you want to challenge the player?"
      actions={[
        {
          label: "Yes",
          onClick: () => {
            dispatch(challengeTrue(gameId));
          },
        },
        {
          label: "No",
          onClick: () => {
            dispatch(challengeFalse(gameId));
          },
        },
      ]}
    />
  );
};

export default ChallengePopup;
