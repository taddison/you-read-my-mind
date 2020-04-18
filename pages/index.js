import React from "react";
import cookie, { serialize } from "cookie";
import { CookieNames } from "../consts";

const Home = ({ sessionId }) => {
  return (
    <div className="min-h-screen flex flex-col text-gray-700">
      <header className="bg-gray-200 p-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          You Read My Mind
        </h1>
      </header>
      <main className="flex flex-grow flex-col m-3">
        Join a game (/game/gameId)
      </main>
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

export default Home;
