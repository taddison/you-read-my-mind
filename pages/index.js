import React from "react";

const Home = () => {
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
        <small>This page is currently static</small>
      </footer>
    </div>
  );
};

export default Home;
