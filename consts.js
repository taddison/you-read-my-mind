export const CookieNames = {
  Session: "sid"
};

export const RoundStates = {
  WaitingForPlayers: "WaitingForPlayers",
  SettingSecrets: "SettingSecrets",
  Guessing: "Guessing",
  Finished: "Finished"
};

export const ApiRoutes = {
  GetGameState: "/api/getGameState",
  TakeRole: "/api/takeRole",
  RelinquishRole: "/api/relinquishRole"
};

export const ScoreRange = {
  Max: 15,
  Min: -15
};
