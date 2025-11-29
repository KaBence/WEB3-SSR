import type { PlayerSpecs } from "../src/model/game";
import type { PlayerNames } from "domain/src/model/Player";
import * as api from "@/model/api"
import "./OtherPlayerBar.css"

export default function PlayersBar({
  players,
  gameId,
  myPlayerId,
  currentTurnId,
}: {
  players: PlayerSpecs[];
  gameId: number;
  myPlayerId?: number;
  currentTurnId?: number;
  
}) {
  const onAccuseUno = (accusedPlayerId: PlayerNames) => {
    if (myPlayerId === undefined) return
    api.accuseUno(gameId,myPlayerId,accusedPlayerId)
  };

  const visiblePlayers = players.filter(
    (p) => myPlayerId === undefined || p.playerName !== myPlayerId
  )

  return (
    <div className="players-bar">
      {visiblePlayers.map((player) => {
        const isCurrent = currentTurnId !== undefined && player.playerName === currentTurnId;
        const len = player.hand.length;
        const cardWidth = 68;
        const spacing = 14;
        const stackWidth = Math.max(
          cardWidth + 30,
          Math.min(360, cardWidth + (len - 1) * spacing + 40)
        );
        const centerOffset = stackWidth / 2 - cardWidth / 2;

        return (
          <div
            key={player.playerName}
            className={`player-card ${isCurrent ? "active" : ""}`}
          >
            <div className="player-header">
              <span className="avatar">{player.name[0] ?? "?"}</span>
              <div className="player-meta">
                <div className="player-name">{player.name}</div>
                {isCurrent && <span className="turn-pill">Playing</span>}
              </div>
            </div>

            <div className="hand-row">
              <div className="card-stack" style={{ width: `${stackWidth}px` }}>
                {player.hand.map((_, index) => {
                  const left = centerOffset + (index - (len - 1) / 2) * spacing;
                  return (
                    <div
                      key={index}
                      className="card back"
                      style={{
                        transform: `rotate(${index * 3 - len * 1.5}deg)`,
                        left: `${left}px`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="count-pill">{player.hand.length} cards</div>
            </div>

            <div className="call-uno">
              <button onClick={() => onAccuseUno(player.playerName)}>
                Accuse UNO
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
