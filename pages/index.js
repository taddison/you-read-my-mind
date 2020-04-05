import React from "react";
import useSWR from "swr";
import cookie, { serialize } from "cookie";
import { CookieNames, ApiRoutes } from "../consts";
import PlayerList from "../components/playerList";
import JoinLeaveControls from "../components/joinLeaveControls";
import PlayerControls from "../components/playerControls";
import DebugControls from "../components/debugControls";
import GameView from "../components/gameView";
const crypto = require("crypto");

const fetcher = (...args) => {
  return fetch(...args).then((res) => res.json());
};

const Game = ({ sessionId }) => {
  const { data: gameState, error } = useSWR(ApiRoutes.GetGameState, fetcher);
  const isPlayerInGame = !gameState?.players.find(
    (p) => p.sessionId === sessionId
  );

  return (
    <div className="min-h-screen flex flex-col">
        <header className="bg-red-200 p-4">
          <h1 className="text-2xl font-semibold">You Read My Mind</h1>
        </header>
        <main className="flex flex-grow flex-col m-8">
          <PlayerList playerList={gameState?.players} />
          <GameView gameState={gameState} />
          <PlayerControls gameState={gameState} sessionId={sessionId} />
          <JoinLeaveControls isPlayerInGame={isPlayerInGame} />
        </main>
        {process.env.NODE_ENV === "development" && <DebugControls />}
      <footer>
        <small>SessionId: {sessionId}</small>
      </footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie ?? "");

  let sessionId = cookies[CookieNames.Session];

  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString("hex");

    // expire in 1 week
    const expires = new Date(new Date().getTime() + 604800000);

    context.res.setHeader(
      "Set-Cookie",
      serialize(CookieNames.Session, sessionId, { expires })
    );
  }

  return {
    props: { sessionId: sessionId },
  };
}

export default Game;
