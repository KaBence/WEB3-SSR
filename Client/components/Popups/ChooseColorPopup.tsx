"use client"

import Popup from "./Popup";
import { State, useStoreDispatch, useStoreState } from "../../src/stores/store";
import { Colors } from "Domain/src/model/Card";
import { popup_slice } from "@/slices/popup_slice";
import * as api from "@/model/api"

interface ChooseColorPopupProps {
    gameId: number;
    cardID: number;
}

const ChooseColorPopup = ({ gameId, cardID }: ChooseColorPopupProps) => {
    const dispatch = useStoreDispatch();
    const { showColorChange } = useStoreState((state: State) => state.popups);

    const handleChooseColor = async (color: string) => {
        dispatch(popup_slice.actions.setColorSelected(color));
        await api.play(gameId,cardID, color)
        dispatch(popup_slice.actions.closeColorChange());
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
