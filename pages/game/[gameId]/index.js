import React from "react";
import useSWR, { mutate } from "swr";
import cookie, { serialize } from "cookie";
import { useRouter } from "next/router";
import { CookieNames } from "consts";
import PlayerList from "components/playerList";
import PlayerControls from "components/playerControls";
import DebugControls from "components/debugControls";
import GameView from "components/gameView";
const crypto = require("crypto");

const fetcher = (input, init) => {
  return fetch(input, init).then((res) => res.json());
};

const Game = ({ sessionId }) => {
  const router = useRouter();
  const { gameId } = router.query;

  const gameStateRoute = `/api/game/${gameId}`;
  const refreshGameState = () => {
    mutate(gameStateRoute);
  };

  const { data: gameState, error } = useSWR(gameStateRoute, fetcher, {
    refreshInterval: 10000,
  });

  return (
    <div className="min-h-screen flex flex-col text-gray-700">
      <header className="bg-blue-50 p-4">
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
              <PlayerControls
                gameState={gameState}
                sessionId={sessionId}
                gameId={gameId}
                refreshGameState={refreshGameState}
              />
            </section>
            <section className="flex flex-col">
              <PlayerList
                playerList={gameState?.players}
                sessionId={sessionId}
                gameId={gameId}
                refreshGameState={refreshGameState}
              />
            </section>
          </>
        )}
      </main>
      {process.env.NODE_ENV === "development" && (
        <DebugControls refreshGameState={refreshGameState} />
      )}
      <footer className="bg-blue-50 p-1">
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
      serialize(CookieNames.Session, sessionId, { expires, path: "/" })
    );
  }

  return {
    props: { sessionId: sessionId },
  };
}

export default Game;
