import React from "react";
import useSWR from "swr";
import cookie, { serialize } from "cookie";
import { useRouter } from "next/router";
import { CookieNames, ApiRoutes } from "../../../consts";
import PlayerList from "../../../components/playerList";
import JoinLeaveControls from "../../../components/joinLeaveControls";
import PlayerControls from "../../../components/playerControls";
import DebugControls from "../../../components/debugControls";
import GameView from "../../../components/gameView";
const crypto = require("crypto");

const fetcher = (...args) => {
  return fetch(...args).then((res) => res.json());
};

const Game = ({ sessionId }) => {
  const router = useRouter();
  const { gameId } = router.query;

  const { data: gameState, error } = useSWR(`${ApiRoutes.GetGameState}/${gameId}`, fetcher);
  const isPlayerInGame = gameState?.players?.find(
    (p) => p.sessionId === sessionId
  );

  return (
    <div className="min-h-screen flex flex-col text-gray-700">
      <header className="bg-gray-200 p-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          You Read My Mind
        </h1>
      </header>
      <main className="flex flex-grow flex-col m-3">
        {!gameState ? (
          <div>Loading...</div>
        ) : (
          <>
            <section className="flex flex-1 flex-col">
              <GameView gameState={gameState} />
              <PlayerControls gameState={gameState} sessionId={sessionId} />
            </section>
            <section className="flex flex-col">
              <PlayerList playerList={gameState?.players} sessionId={sessionId} />
              <JoinLeaveControls isPlayerInGame={isPlayerInGame} />
            </section>
          </>
        )}
      </main>
      {process.env.NODE_ENV === "development" && <DebugControls />}
      <footer className="bg-gray-200 p-1">
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
