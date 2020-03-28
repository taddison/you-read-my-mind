import React from "react";
import cookie, { serialize } from "cookie";
import { SESSION_COOKIE_NAME } from "../consts"
const crypto = require("crypto");

const Game = ({ sessionId }) => {
  return (
    <>
    <header>
      <h1>You Read My Mind</h1>
    </header>
    <main>
      I am the super game.
    </main>
    <footer>
      <small>SessionId: {sessionId}</small>
    </footer>
    </>
  );
};

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie ?? "");

  let sessionId = cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString("hex");
    
    // expire in 1 week
    const expires = new Date(new Date().getTime()+604800000);
    
    context.res.setHeader(
      "Set-Cookie",
      serialize(SESSION_COOKIE_NAME, sessionId, { expires })
    );
  }

  return {
    props: { sessionId: sessionId }
  };
}

export default Game;
