import React, { useRef } from "react";
import useSWR, { mutate } from "swr";
import cookie, { serialize } from "cookie";
import { CookieNames } from "../consts";
import PlayerList from "../components/playerList";
const crypto = require("crypto");

const fetcher = (...args) => {
  return fetch(...args).then(res => res.json());
};

const Game = ({ sessionId }) => {
  const { data: gameState, error } = useSWR("/api/getGameState", fetcher);
  const playerName = useRef(null);
  const isPlayerInGame = !gameState?.players.find(
    p => p.sessionId === sessionId
  );

  return (
    <>
      <header>
        <h1>You Read My Mind</h1>
      </header>
      <main>
        <div>
          {!isPlayerInGame && (
            <button
              onClick={async () => {
                await fetch("/api/removePlayer", {
                  method: "POST"
                });
                mutate("/api/getGameState");
              }}
            >
              Remove Me
            </button>
          )}
          {isPlayerInGame && (
            <form>
              <label>Enter your name</label>
              <input ref={playerName} />
              <button
                onClick={async e => {
                  e.preventDefault();
                  await fetch("/api/addPlayer", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: playerName.current.value })
                  });
                  mutate("/api/getGameState");
                }}
              >
                Join
              </button>
            </form>
          )}
        </div>
        <PlayerList playerList={gameState?.players} />
      </main>
      <footer>
        <small>SessionId: {sessionId}</small>
      </footer>
    </>
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
