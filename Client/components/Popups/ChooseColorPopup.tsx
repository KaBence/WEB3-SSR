import Popup from "./Popup";
import { useStoreDispatch, useStoreState } from "../../src/stores/store";
import { Colors } from "Domain/src/model/Card";

interface ChooseColorPopupProps {
  gameId: number;
  cardIndex: number;
}

const ChooseColorPopup = ({ gameId, cardIndex }:ChooseColorPopupProps) => {
  const dispatch = useStoreDispatch();
  const { showColorChange } = useStoreState().popups;

  const handleChooseColor = async (color: string) => {
    await chooseColor(gameId, cardIndex, color, dispatch)
  };

  return (
    <Popup
      visible={showColorChange}
      title="Choose a color:"
      footer={
        <div className="color-grid">
          <button className="red" onClick={() => handleChooseColor(Colors.Red)}>Red</button>
          <button className="blue" onClick={() => handleChooseColor(Colors.Blue)}>Blue</button>
          <button className="yellow" onClick={() => handleChooseColor(Colors.Yellow)}>Yellow</button>
          <button className="green" onClick={() => handleChooseColor(Colors.Green)}>Green</button>
        </div>
      }
    />
  );
};

export default ChooseColorPopup;
