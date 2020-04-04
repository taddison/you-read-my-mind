import React from "react";
import useSWR from "swr";
import cookie, { serialize } from "cookie";
import { CookieNames, ApiRoutes } from "../consts";
import PlayerList from "../components/playerList";
import PlayerControls from "../components/playerControls";
import PsychicControls from "../components/psychicControls";
import GuesserControls from "../components/guesserControls";
import DebugControls from "../components/debugControls";
import GameView from "../components/gameView";
const crypto = require("crypto");

const fetcher = (...args) => {
  return fetch(...args).then(res => res.json());
};

const Game = ({ sessionId }) => {
  const { data: gameState, error } = useSWR(ApiRoutes.GetGameState, fetcher);
  const isPlayerInGame = !gameState?.players.find(
    p => p.sessionId === sessionId
  );
  const isPsychic = gameState?.round?.psychic === sessionId;
  const isGuesser = gameState?.round?.guesser === sessionId;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold">You Read My Mind</h1>
      </header>
      <main>
        <PlayerList playerList={gameState?.players} />
        <GameView gameState={ gameState } />
        {isPsychic && <PsychicControls roundState={ gameState?.round?.state } secretScore={ gameState?.round?.psychicScore } />}
        {isGuesser && <GuesserControls />}
        <PlayerControls isPlayerInGame={isPlayerInGame} />
      </main>
      <section className="bg-gray-200 p-2 mt-4">
        <DebugControls />
      </section>
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
    props: { sessionId: sessionId }
  };
}

export default Game;
